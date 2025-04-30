from django.shortcuts import render, redirect
from api.models import *
from django.core.paginator import Paginator

def login(request):
    return render(request, 'index.html')




def home(request):
   
    users = CustomUser.objects.all().order_by("-saldo")[:4]
    
    desafio_list = Desafio.objects.filter(idCampanha__isnull=True)
    desafio_paginator = Paginator(desafio_list, 5) 
    desafio_page = request.GET.get('desafio_page') 
    desafios = desafio_paginator.get_page(desafio_page)  

    context = {
        'usuarios': users,  
        'primeiro_usuario': users[0] if users else None,  
        'desafios': desafios,  
    }

    return render(request, 'UserHtml/home.html', context)


def historicoCompra(request):
    eventos = Campanha.objects.filter(is_active=True)

    compra = Compra.objects.filter(idUsuario = request.user.id).order_by('-dataCompra')
    compra_paginator = Paginator(compra, 5)
    compra_page = request.GET.get('compra_page')
    compras = compra_paginator.get_page(compra_page)
        
    return render(request, 'UserHtml/historicoCompra.html', {'compra': compras, 'eventos': eventos})

def primeiroAcesso(request):
    return render(request, 'primeiroAcesso.html')

def perfilUsuario(request):
    return render(request, 'UserHtml/perfilUsuario.html')

def listaProdutos(request):
    # produtos = [ 
    # {
    #     'id': 1,
    #     'nome': "Produto 1 ",
    #     'qtd': 2,
    #     'valor': "200",
    #     'descricao': "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    # },
    # ]
    produtos = Produto.objects.filter(is_active=True)
    return render(request, 'UserHtml/listaProdutos.html', {"produtos": produtos})

def cadastrarDesafio(request):
    campanhas = Campanha.objects.filter(is_active=True)
     
    return render(request, 'AdmHtml/cadastrarDesafio.html', {'campanhas': campanhas})

def ranking(request):
    return render(request, 'UserHtml/ranking.html')

def listaEstoque(request):
    eventos = Campanha.objects.filter(is_active=True)
             

    

    estoque_list = Produto.objects.filter(is_active=True)
    estoque_paginator = Paginator(estoque_list, 5) 
    estoque_page = request.GET.get('estoque_page') 
    estoque = estoque_paginator.get_page(estoque_page)  

    
    return render(request, 'AdmHtml/listaEstoque.html', {'estoque': estoque, 'eventos': eventos})

def listaDeDesafios(request):
    desafio = Desafio.objects.filter(is_active = True)
    desafio_paginator = Paginator(desafio, 5)
    desafio_page = request.GET.get('desafio_page')
    desafios = desafio_paginator.get_page(desafio_page)

    campanhas = Campanha.objects.filter(is_active=True)

    return render(request, 'AdmHtml/listaDeDesafios.html', {'desafios': desafios, 'campanhas': campanhas})

def listaDeUsuarios(request):
    
    user = CustomUser.objects.all()
    user_paginator = Paginator(user, 5)
    user_page = request.GET.get('user_page')
    usuarios = user_paginator.get_page(user_page)
    

    return render(request, 'AdmHtml/listaDeUsuarios.html', {'usuarios': usuarios})

def desafiosCampanha(request):

    desafios = Desafio.objects.filter(idCampanha=True)

    return render(request, 'UserHtml/desafiosCampanha.html', {'desafios': desafios})


def listaDePedidos(request):
    return render(request, 'AdmHtml/listaDePedidos.html')

def carrinho(request):
    return render(request, 'UserHtml/carrinhoCompra.html')


def relatorio(request):
    return render(request, 'components/adm/relatorio.html')

def campanhas(request):

    campanhas = Campanha.objects.all()

    return render(request, 'components/adm/campanhas.html', {'campanhas': campanhas})

def teste(request):
    return render(request, 'UserHtml/teste.html')

def cadastrarUsuario(request):
    return render(request, 'AdmHtml/cadastrarUsuario.html')

def editarUsuario(request, id):
    
    userId = CustomUser.objects.filter(id=id).first()
    return render(request, 'AdmHtml/editarUsuario.html', {'userId': userId})


def adicionarMoedas(request):
    return render(request, 'AdmHtml/adicionarMoedas.html')

