resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  enable_dns_support = true
  enable_dns_hostnames = true
  tags = merge(var.default_tags, {
    "Name" = var.prefix
  })
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  tags = merge(var.default_tags, {
    "Name" = var.prefix
  })
}

resource "aws_subnet" "public_1" {
  vpc_id            = aws_vpc.main.id
  availability_zone = "ap-northeast-1a"
  cidr_block        = "10.0.10.0/24"

  tags = merge(var.default_tags, {
    "Name" = "${var.prefix}-public-subnet-1"
  })
}

resource "aws_subnet" "public_2" {
  vpc_id            = aws_vpc.main.id
  availability_zone = "ap-northeast-1c"
  cidr_block        = "10.0.11.0/24"

  tags = merge(var.default_tags, {
    "Name" = "${var.prefix}-public-subnet-2"
  })
}

resource "aws_subnet" "private_1" {
  vpc_id            = aws_vpc.main.id
  availability_zone = "ap-northeast-1a"
  cidr_block        = "10.0.12.0/24"

  tags = merge(var.default_tags, {
    "Name" = "${var.prefix}-private-subnet-1"
  })
}

resource "aws_subnet" "private_2" {
  vpc_id            = aws_vpc.main.id
  availability_zone = "ap-northeast-1c"
  cidr_block        = "10.0.13.0/24"

  tags = merge(var.default_tags, {
    "Name" = "${var.prefix}-private-subnet-2"
  })
}