terraform {
  backend "s3" {
    profile = "gatekeeper"
    bucket  = "gatekeeper-terraform"
    key     = "gatekeeper.tfstate"
    region  = "ap-northeast-1"
    encrypt = true
  }
}
