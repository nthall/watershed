from __future__ import unicode_literals

import json
import logging

from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.contrib.auth import authenticate, get_user_model, login
from django.views.decorators.csrf import csrf_exempt

from rest_framework.authtoken.models import Token

from forms import RegistrationForm

User = get_user_model()

logger = logging.getLogger(__name__)


def register(request):
    if request.method == "POST":
        # process signup
        pass

    else:
        form = RegistrationForm()
        return render(request, 'register.html', {'form': form})


@csrf_exempt
def register_rest(request):
    if request.method == "POST":
        form = RegistrationForm(json.loads(request.body))
        if form.is_valid():
            username = form.cleaned_data.get('email_address')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is None:
                user = User.objects.create_user(username, password)
                login(request, user)

            return JsonResponse({'token': user.auth_token.key})
        else:
            return JsonResponse({'errors': form.errors}, status=400)
    else:
        return HttpResponse(status=405)
