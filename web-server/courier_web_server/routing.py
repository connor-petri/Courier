from django.urls import path
from .consumers import AudioStreamConsumer

websocket_urlpatterns = [
    path('ws/audio_stream/', AudioStreamConsumer.as_asgi()),
]
# This file defines the routing for the Django Channels application.