"""
alt models
"""

from django.db import models

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


class UserManager(BaseUserManager):
    def create_user(self, email, password=None):
        if not email:
            raise ValueError("Accounts must have an email address")

        user = self.model(email=self.normalize_email(email))
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None):
        user = self.create_user(email, password)
        user.is_admin = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    """
    override User model
    """

    email = models.EmailField(
        verbose_name="email address", max_length=255, unique=True, blank=False
    )
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    position = models.IntegerField(default=0)  # this is the play pointer

    objects = UserManager()

    def get_full_name(self):
        return self.email

    def get_short_name(self):
        return self.email

    def __unicode__(self):
        return self.email

    USERNAME_FIELD = "email"

    def has_perm(self, perm, obj=None):
        """
        TODO: custom perms for reading a user's updates (at the minimum)
              (OR - separate Account model?? ugh idk)
        """
        if self.is_admin:
            return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.is_admin
