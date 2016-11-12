from __future__ import unicode_literals

from django.forms import forms

from models import Account


class RegistrationForm(forms.ModelForm):

    class Meta:
        model = Account
        fields = ['email', 'password1', 'password2',
                  'first_name', 'last_name', ]
