from __future__ import unicode_literals

from django.conf.urls import url

from rest_framework.urlpatterns import format_suffix_patterns

import views

urlpatterns = [
    url(r'^queue/$', views.Queue.as_view()),
    url(r'^item/(?P<item_id>[0-9]+)/$',
        views.ItemDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
