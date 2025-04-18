from django.http import JsonResponse
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.shortcuts import render

def login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return JsonResponse({"token": token.key, "username": user.username}, status=200)
        else:
            return JsonResponse({"error": "Invalid credentials"}, status=401)
    elif request.method == 'GET':
        return render(request, 'index.html')
    else:
        return JsonResponse({"error": "Method not allowed"}, status=405)
