variable "allowed_ips" {
  type = map(string)
  default = {
    nogawaHome = "110.2.118.166/32"
  }
}

variable "default_tags" {
  default = {
    Project = "gatekeeper"
  }
  description = "Additional resource tags"
  type        = map(string)
}

variable "prefix" {
  default     = "gatekeeper"
  description = "prefix"
  type        = string
}