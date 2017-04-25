from __future__ import unicode_literals

from django.shortcuts import render
from django.contrib.auth import get_user_model

from api.models import Item

User = get_user_model()


def index(request):
    context = {
        "save_count": Item.objects.count(),
        "user_count": User.objects.count(),
        "play_count": 'coming soon!'
    }

    return render(request, 'stats/index.html', context)
