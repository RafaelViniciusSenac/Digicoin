from rest_framework import viewsets, status
from api.models import *
from api.serializers import *
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import make_password




class User(APIView):

    def get(self, request, id=None):
        if id:
            usuario = get_object_or_404(CustomUser, pk=id)
            serializer = UserSerializer(usuario)
            return Response(serializer.data, status= status.HTTP_200_OK)

        usuario = CustomUser.objects.all()
        serializer = UserSerializer(usuario, many=True)
        return Response(serializer.data, status= status.HTTP_200_OK)

    def post(self, request):
        nome = request.data.get('nome')
        senha = request.data.get('senha')
        ra = request.data.get('ra')
        fistName = request.data.get('first_name')
        # isAdm = request.data.get('is_adm')

        if not nome or not senha:
            return Response({"error": "Todos os campos são obrigatórios!", "status": status.HTTP_400_BAD_REQUEST}, status= status.HTTP_400_BAD_REQUEST)

        usuario = CustomUser.objects.create(
            username = nome,
            password = make_password(senha),
            is_active = True,
            first_name = fistName,
            
            ra = ra
        )
        return Response({"message":"Usuário criado com sucesso!", "id":usuario.id, "status": status.HTTP_201_CREATED})

    def put(self, request, id):
        usuario = get_object_or_404(CustomUser, pk=id)
        operacao = request.data.get('operacao')

        data = request.data.copy()

        if operacao in ['adicionar', 'remover']:
            try:
                saldo = int(data.get("saldo", 0))
            except (TypeError, ValueError):
                return Response({"erro": "Saldo inválido."}, status=status.HTTP_400_BAD_REQUEST)

            # Remove campos que serão modificados manualmente
            data.pop('saldo', None)
            data.pop('pontuacao', None)

            if operacao == 'adicionar':
                usuario.pontuacao += saldo
                usuario.saldo += saldo
            elif operacao == 'remover':
                if usuario.saldo < saldo:
                    return Response({"erro": "Saldo insuficiente."}, status=status.HTTP_400_BAD_REQUEST)
                usuario.saldo -= saldo

            usuario.save()

        serializer = UserSerializer(usuario, data=data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({"status": status.HTTP_200_OK})

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        usuario = get_object_or_404(CustomUser, pk = id)
        if usuario:
            usuario.delete()
            return Response({"status": status.HTTP_200_OK})
        else:
            return Response({"status": status.HTTP_404_NOT_FOUND})
        
class Login(APIView):
    def post(self, request):
        nome = request.data.get('nome')
        senha = request.data.get('senha')

        usuario = authenticate(username=nome, password=senha)
        
        if(usuario):
            login(request, usuario)
            return Response({"status": status.HTTP_200_OK})
        else:
            return Response({"mensagem": "Usuario nao encontrado!", "status": status.HTTP_401_UNAUTHORIZED})
        
class Logout(APIView):
    def post(self, request):
        logout(request)
        return Response({"status": status.HTTP_200_OK, "mensagem": "Logout realizado com sucesso"})

class GetDadosUsuarioLogado(APIView):
    def get(self, request):
        usuarioId = request.session.get('_auth_user_id')
        if usuarioId:
            usuario = CustomUser.objects.filter(id= usuarioId).first()
            serializer = UserSerializer(usuario)
            return Response(serializer.data)

        return Response(usuarioId)
    

    
class CampanhaViewSet(viewsets.ModelViewSet):
    queryset = Campanha.objects.all()
    serializer_class = CampanhaSerializer

class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer

class DesafioViewSet(viewsets.ModelViewSet):
    queryset = Desafio.objects.all()
    serializer_class = DesafioSerializer

class CompraViewSet(viewsets.ModelViewSet):
    queryset = Compra.objects.all()
    serializer_class = CompraSerializer

class ItensCompraViewSet(viewsets.ModelViewSet):
    queryset = ItensCompra.objects.all()
    serializer_class = ItensCompraSerializer

class CadastrarCompraView(APIView):
    def post(self, request):
        dadosCompra = request.data.get('compra')
        itensCompra = request.data.get('itens')

        # Cria a compra
        compraSerializer = CompraSerializer(data=dadosCompra)
        if compraSerializer.is_valid():
            compra = compraSerializer.save()
        else:
            return Response(compraSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Cria os itens de compra
        for item in itensCompra:
            item['idCompra'] = compra.id
            itemSerializer = ItensCompraSerializer(data=item)
            if itemSerializer.is_valid():
                itemSerializer.save()
                print("Item criado com sucesso!")
            else:
                print("deu erro")
                return Response(itemSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Compra e itens criados com sucesso!", "status": status.HTTP_201_CREATED})
    
class HistoricoSaldoUsuarioView(APIView):
    """Retorna as últimas 5 alterações de saldo do usuário logado"""
    def get(self, request):
        usuario = request.user
        serializer = UsuarioComHistoricoSerializer(usuario)
        return Response(serializer.data, status=status.HTTP_200_OK)

class HistoricoSaldoPorIdView(APIView):
    """Retorna as últimas 5 alterações de saldo de um usuário pelo ID"""
    def get(self, request, id):
        usuario = get_object_or_404(CustomUser, pk=id)
        serializer = UsuarioComHistoricoSerializer(usuario)
        return Response(serializer.data, status=status.HTTP_200_OK)