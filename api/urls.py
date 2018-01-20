from __future__ import unicode_literals

from django.conf.urls import url

from rest_framework.urlpatterns import format_suffix_patterns

import views

urlpatterns = [
    url(r'^position/$', views.Position.as_view()),
    url(r'^queue/$', views.Queue.as_view()),
    url(r'^item/$',
        views.ItemDetail.as_view()),
    url(r'^jslog/$',
        views.JsLog.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
