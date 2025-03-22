from django.shortcuts import render, redirect
from api.models import *

def login(request):
    return render(request, 'index.html')


def home(request):
    
    user = CustomUser.objects.all()
    context = {
        'usuarios': user[1:],
        'primeiro_usuario': user[0] if user else None
    }
    return render(request, 'UserHtml/home.html', context)
    
def historicoCompra(request):
    return render(request, 'UserHtml/historicoCompra.html')
def primeiroAcesso(request):
    return render(request, 'primeiroAcesso.html')

def perfilUsuario(request):
    return render(request, 'UserHtml/perfilUsuario.html')

def listaProdutos(request):
    return render(request, 'UserHtml/listaProdutos.html')

def cadastrarDesafio(request):
    return render(request, 'AdmHtml/cadastrarDesafio.html')
def ranking(request):
    return render(request, 'UserHtml/ranking.html')
