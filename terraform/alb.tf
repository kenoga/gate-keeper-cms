resource "aws_security_group" "alb" {
  name        = "${var.prefix}-alb"
  description = "${var.prefix}-alb"
  vpc_id      = aws_vpc.main.id

  tags = merge(var.default_tags, {
    Name = "${var.prefix}-alb"
  })
}

resource "aws_security_group_rule" "alb_outbound_sgr" {
  security_group_id = aws_security_group.alb.id
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "alb_inbound_sgr_http" {
  security_group_id = aws_security_group.alb.id

  type      = "ingress"
  from_port = 80
  to_port   = 80
  protocol  = "tcp"

  cidr_blocks = ["0.0.0.0/0"]
  description = "80 is welcome"
}

resource "aws_security_group_rule" "alb_inbound_sgr_https" {
  security_group_id = aws_security_group.alb.id

  type      = "ingress"
  from_port = 443
  to_port   = 443
  protocol  = "tcp"

  cidr_blocks = ["0.0.0.0/0"]
  description = "443 is welcome"
}

resource "aws_lb" "main" {
  name               = var.prefix
  load_balancer_type = "application"

  security_groups = [aws_security_group.alb.id]
  subnets         = [aws_subnet.public_1.id, aws_subnet.public_2.id]

  tags = merge(var.default_tags, {
    Name = "${var.prefix}-lb"
  })
}

resource "aws_lb_target_group" "main" {
  name = var.prefix

  vpc_id = aws_vpc.main.id

  port        = 80
  protocol    = "HTTP"
  target_type = "ip"

  health_check {
    port = 80
    path = "/api/health"
  }

  depends_on = [aws_lb.main]

  tags = merge(var.default_tags, {
    Name = "${var.prefix}-lb-tgr"
  })
}

resource "aws_lb_listener" "https" {
  port              = "443"
  protocol          = "HTTPS"
  load_balancer_arn = aws_lb.main.arn
  certificate_arn   = data.aws_acm_certificate.main.arn
  ssl_policy        = "ELBSecurityPolicy-2016-08"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.main.arn
  }
}

resource "aws_lb_listener_rule" "https" {
  listener_arn = aws_lb_listener.https.arn

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.main.id
  }

  condition {
    path_pattern {
      values = ["*"]
    }
  }
}

