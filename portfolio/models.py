from django.db import models
from users.models import UserProfile




class Technology(models.Model):
    """
    Model for saving names of technologies
    """
    name = models.CharField(max_length=100, unique=True, verbose_name="Назва технології")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Технологія"
        verbose_name_plural = "Технології"
        ordering = ['name']


class Project(models.Model):
    """
    Model for saving info about projects
    """
    profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="projects", verbose_name="Профіль")
    title = models.CharField(max_length=100, verbose_name="Назва проекту")
    description = models.TextField(verbose_name="Опис")
    image = models.ImageField(upload_to="project_images/", null=True, blank=True, verbose_name="Зображення")
    github_link = models.URLField(max_length=255, null=True, blank=True, verbose_name="Посилання на GitHub")
    live_link = models.URLField(max_length=255, null=True, blank=True, verbose_name="Посилання на сайт")
    technologies = models.ManyToManyField(Technology, related_name="projects", verbose_name="Технології")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата створення")

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Проект"
        verbose_name_plural = "Проекти"
        ordering = ['-created_at']


class Experience(models.Model):
    """
    Model for hands-on experience
    """
    profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE,
                                related_name="experience", verbose_name="Профіль")
    company = models.CharField(max_length=100, verbose_name="Компанія")
    role = models.CharField(max_length=100, verbose_name="Посада")
    start_date = models.DateField(verbose_name="Дата початку")
    end_date = models.DateField(null=True, blank=True, verbose_name="Дата закінчення")
    description = models.TextField(null=True, blank=True, verbose_name="Опис обов'язків")

    def __str__(self):
        return f"{self.role} в {self.company}"

    class Meta:
        verbose_name = "Досвід роботи"
        verbose_name_plural = "Досвід роботи"
        ordering = ['-start_date']


class Education(models.Model):
    profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE,
                                related_name="education", verbose_name="Профіль")
    institution = models.CharField(max_length=200, verbose_name="Навчальний заклад")
    degree = models.CharField(max_length=100, verbose_name="Ступінь")
    field_of_study = models.CharField(max_length=100, verbose_name="Спеціальність")
    start_date = models.DateField(verbose_name="Дата початку")
    end_date = models.DateField(null=True, blank=True, verbose_name="Дата закінчення")

    def __str__(self):
        return f"{self.degree} з {self.field_of_study}, {self.institution}"

    class Meta:
        verbose_name = "Освіта"
        verbose_name_plural = "Освіта"
        ordering = ['-start_date']




