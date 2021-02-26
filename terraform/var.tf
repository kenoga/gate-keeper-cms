variable "allowed_ips" {
  type = map(string)
  default = {
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