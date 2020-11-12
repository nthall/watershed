"""
watershed URL Configuration
"""
from django.urls import include, path
from django.contrib import admin

import rest_framework.authtoken.views as tokenviews

import customauth.views as authviews

admin.autodiscover()

urlpatterns = [
    path(r"^admin/stats/", include("stats.urls")),
    path(r"^admin/", admin.site.urls),
    path(r"^auth/", include("rest_framework.urls", namespace="rest_framework")),
    path(r"^register/", authviews.register_rest),
    path(r"^authtoken/", tokenviews.obtain_auth_token),
    path(r"", include("api.urls")),
    path(r"", include("player.urls")),
]
