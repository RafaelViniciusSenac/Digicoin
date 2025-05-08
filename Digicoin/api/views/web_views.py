from django.shortcuts import render, redirect
from api.models import *
from django.core.paginator import Paginator
from ..serializers import UsuarioComHistoricoSerializer

def login(request):
    return render(request, 'index.html')



def home(request):

    userId = request.session.get('_auth_user_id')

    
    user = CustomUser.objects.filter(id=userId).first()
    primeiroAcesso = user.primeiroAcesso
    
    users = CustomUser.objects.all().order_by("-saldo")[:4]
        
    desafio_list = Desafio.objects.filter(idCampanha__isnull=True)
    desafio_paginator = Paginator(desafio_list, 5) 
    desafio_page = request.GET.get('desafio_page') 
    desafios = desafio_paginator.get_page(desafio_page)  

    context = {
        'usuarios': users,  
        'primeiro_usuario': users[0] if users else None,  
        'desafios': desafios,
        'primeiroAcesso' : primeiroAcesso,
        'userId': userId    
    }

    return render(request, 'UserHtml/home.html', context)
   


def historicoCompra(request):
    return render(request, 'UserHtml/historicoCompra.html')
def primeiroAcesso(request):
    return render(request, 'primeiroAcesso.html')

def perfilUsuario(request):
    usuarioLogado = request.user
    serializer = UsuarioComHistoricoSerializer(usuarioLogado)
    dados_usuario = serializer.data

    context = {
        'historico': dados_usuario["ultimas_alteracoes"],  
        'saldoAtual': dados_usuario["ultimas_alteracoes"][0]
    }

    return render(request, 'UserHtml/perfilUsuario.html', context)

def listaProdutos(request):

    listaProtudos_list = Produto.objects.filter(is_active=True)
    listaProdutos_paginator = Paginator(listaProtudos_list, 8) 
    listaProdutos_page = request.GET.get('listaProduto_page') 
    listaProduto = listaProdutos_paginator.get_page(listaProdutos_page)
    
    return render(request, 'UserHtml/listaProdutos.html', {"produtos": listaProduto})

def cadastrarDesafio(request):
    campanhas = Campanha.objects.filter(is_active=True)
     
    return render(request, 'AdmHtml/cadastrarDesafio.html', {'campanhas': campanhas})

def ranking(request):
    top_usuarios = CustomUser.objects.order_by('-saldo')[:7]
    return render(request, 'UserHtml/ranking.html', {'top_usuarios': top_usuarios})


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
    status_pedido = request.GET.get('status', None)  
    print(status_pedido)

    pedidos = 0 

    if status_pedido == '1':
        pedidos = ItensCompra.objects.select_related('idProduto', 'idCompra').filter(idCompra__pedido="concluido")
    elif status_pedido == '2':
        pedidos = ItensCompra.objects.select_related('idProduto', 'idCompra').filter(idCompra__pedido="pendente")
    else:
        pedidos = ItensCompra.objects.select_related('idProduto', 'idCompra').all() 

    pedido_paginator = Paginator(pedidos, 5) 
    pedido_page = request.GET.get('pedido_page')
    pedidos = pedido_paginator.get_page(pedido_page)

    return render(request, 'AdmHtml/listaDePedidos.html', {'pedidos': pedidos})


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

