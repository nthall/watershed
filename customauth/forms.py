from __future__ import unicode_literals

from django import forms
from django.core.exceptions import ValidationError

from passwords.fields import PasswordField


class RegistrationForm(forms.Form):
    email_address = forms.EmailField(label="Email", max_length=255)
    password = PasswordField(label="Password")
    password2 = PasswordField(label="Confirm Password")

    def clean(self):
        cleaned_data = super(RegistrationForm, self).clean()
        password = cleaned_data.get('password')
        password2 = cleaned_data.get('password2')

        if password != password2:
            raise ValidationError("Passwords must match!")

        return cleaned_data
