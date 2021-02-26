
resource "aws_db_parameter_group" "default" {
  name   = "default-mysql-8"
  family = "mysql8.0"

  parameter {
    name  = "character_set_server"
    value = "utf8mb4"
  }

  parameter {
    name  = "character_set_client"
    value = "utf8mb4"
  }
}

resource "aws_security_group" "rds" {
  name        = "${var.prefix}-rds"
  description = "${var.prefix}-rds"
  vpc_id      = aws_vpc.main.id

  tags = merge(var.default_tags, {
    Name = "${var.prefix}-rds"
  })
}

resource "aws_security_group_rule" "rds_inbound_sgr" {
  security_group_id        = aws_security_group.rds.id
  type                     = "ingress"
  from_port                = 3306
  to_port                  = 3306
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.ecs.id
}

resource "aws_security_group_rule" "rds_inbound_sgr_2" {
  security_group_id        = aws_security_group.rds.id
  type                     = "ingress"
  from_port                = 3306
  to_port                  = 3306
  protocol                 = "tcp"
  for_each = var.allowed_ips
  cidr_blocks = [each.value]

}


resource "aws_db_subnet_group" "main" {
  name       = var.prefix
  subnet_ids = [aws_subnet.public_1.id, aws_subnet.public_2.id]

  tags = merge(var.default_tags, {
    Name = var.prefix
  })
}

# resource "aws_db_instance" "default" {
#   identifier             = var.prefix
#   allocated_storage      = 10
#   engine                 = "mysql"
#   engine_version         = "8.0"
#   instance_class         = "db.t3.micro"
#   name                   = "gatekeeper"
#   username               = "admin"
#   password               = "anSD7eXLbHgztsJ5"
#   parameter_group_name   = aws_db_parameter_group.default.name
#   skip_final_snapshot    = true
#   availability_zone      = "ap-northeast-1a"
#   db_subnet_group_name   = aws_db_subnet_group.main.name
#   vpc_security_group_ids = [aws_security_group.rds.id]

#   tags = merge(var.default_tags, {
#     Name = "${var.prefix}-mysql"
#   })
# }