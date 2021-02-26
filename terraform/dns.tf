# data "aws_route53_zone" "main" {
#   name         = "coloria.jp."
# }

# resource "aws_route53_record" "metabase" {
#   zone_id = data.aws_route53_zone.main.zone_id
#   name    = "metabase.coloria.jp"
#   type    = "A"

#   alias {
#     name                   = aws_lb.main.dns_name
#     zone_id                = aws_lb.main.zone_id
#     evaluate_target_health = true
#   }
# }