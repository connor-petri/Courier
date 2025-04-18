from django.urls import path
import AudioStreamConsumer

websocket_urlpatterns = [
    path('ws/audio-stream/', AudioStreamConsumer.as_asgi()),
]
# This file defines the routing for the Django Channels application.