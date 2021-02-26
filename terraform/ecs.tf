resource "aws_ecs_cluster" "gatekeeper" {
  name               = "gatekeeper"
  capacity_providers = ["FARGATE_SPOT"]
  default_capacity_provider_strategy {
    capacity_provider = "FARGATE_SPOT"
    weight            = 1
    base              = 0
  }

  tags = merge(var.default_tags, {
    Name = var.prefix
  })
}

resource "aws_security_group" "ecs" {
  name        = "${var.prefix}-ecs"
  description = "${var.prefix}-ecs"
  vpc_id      = aws_vpc.main.id

  tags = merge(var.default_tags, {
    Name = "${var.prefix}-ecs"
  })
}

resource "aws_security_group_rule" "ecs_outbound_sgr" {
  security_group_id = aws_security_group.ecs.id
  type              = "egress"
  to_port           = 0
  protocol          = "-1"
  from_port         = 0
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "ecs_inbound_sgr_http" {
  security_group_id = aws_security_group.ecs.id

  type        = "ingress"
  from_port   = 80
  to_port     = 80
  protocol    = "tcp"
  cidr_blocks = ["10.0.0.0/16"]
}

resource "aws_security_group_rule" "ecs_inbound_sgr_https" {
  security_group_id = aws_security_group.ecs.id

  type        = "ingress"
  from_port   = 443
  to_port     = 443
  protocol    = "tcp"
  cidr_blocks = ["10.0.0.0/16"]
}
