from django.shortcuts import render, redirect
from api.models import *

def login(request):
    return render(request, 'index.html')