variable "region" {
  type        = string
  default     = "ap-northeast-1"
  description = "Region"
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 2.70"
    }
  }
}

provider "aws" {
  profile = "gatekeeper"
  region  = var.region
}
