from django.urls import path
from .AudioStreamConsumer import AudioStreamConsumer

websocket_urlpatterns = [
    path('ws/stream/', AudioStreamConsumer.as_asgi()),
]
# This file defines the routing for the Django Channels application.