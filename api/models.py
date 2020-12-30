from django.db import models
from django.utils import timezone

class User(models.Model):
    name = models.CharField(max_length=256)
    email = models.EmailField(max_length=256)
    encrypted_email = models.CharField(max_length=256)
    updated_at = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(default=timezone.now)

    