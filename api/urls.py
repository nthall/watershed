from django.conf.urls import url

from rest_framework.urlpatterns import format_suffix_patterns

from .views import ItemDetail, JsLog, Position, Queue

urlpatterns = [
    url(r"^position/$", Position.as_view()),
    url(r"^queue/$", Queue.as_view()),
    url(r"^item/$", ItemDetail.as_view()),
    url(r"^jslog/$", JsLog.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
