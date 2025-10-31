from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, verbose_name="Про себе")
    profile_picture = models.ImageField(upload_to="profile_pics/", null=True, blank=True, verbose_name="Фото профілю")
    resume_cv = models.FileField(upload_to="resumes/", null=True, blank=True, verbose_name="Резюме")
    github_url = models.URLField(max_length=255, blank=True)
    linkedin_url = models.URLField(max_length=255, blank=True)

    def __str__(self):
        return f"Профіль: {self.user.username}"

    class Meta:
        verbose_name = "Профіль користувача"
        verbose_name_plural = "Профілі користувачів"




