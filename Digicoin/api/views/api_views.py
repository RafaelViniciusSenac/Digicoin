from rest_framework import viewsets, status
from api.models import *
from api.serializers import *
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
import yagmail
import os
from dotenv import load_dotenv
from django.contrib.auth import get_user_model
import random
import string
from django.conf import settings
import csv
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.http import HttpResponse

class User(APIView):
    
    def get(self, request, id=None):
        if id:
            usuario = get_object_or_404(CustomUser, pk=id)
            serializer = UserSerializer(usuario)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # 👇 SEMPRE começa filtrando NÃO ADMINS
        queryset = CustomUser.objects.filter(is_adm=False)

        nome = request.query_params.get("nome")
        if nome:
            queryset = queryset.filter(first_name__icontains=nome)

        # 👇 Só depois aplica limite de 5
        usuarios = queryset[:5]

        serializer = UserSerializer(usuarios, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


    permission_classes = [IsAuthenticated]

    def post(self, request):
        nome = request.data.get('nome')
        senha = request.data.get('senha')
        ra = request.data.get('ra')
        firstName = request.data.get('first_name')
        isAdm = request.data.get('is_adm')
        

        if not nome or not senha:
            return Response({"error": "Todos os campos são obrigatórios!", "status": status.HTTP_400_BAD_REQUEST}, status= status.HTTP_400_BAD_REQUEST)

        usuario = CustomUser.objects.create(
            username = nome,
            password = make_password(senha),
            is_active = True,
            first_name = firstName,
            is_adm = isAdm,
            ra = ra
        )

        # Enviar email após cadastro #
        load_dotenv()

        yag = yagmail.SMTP(
            user=os.getenv("EMAIL_USER"),
            password=os.getenv("EMAIL_PASSWORD"),
            host=os.getenv("EMAIL_HOST"),
            port=int(os.getenv("EMAIL_PORT")),
            smtp_starttls=True,       
            smtp_ssl=False    
        )

        yag.send(
            to=usuario.username,
            subject='Bem vindo ao Sistema Digicoin',
            contents=(
                f'Nome: {firstName}\n'
                f'RA: {ra}\n'
                f'Login: {nome}\n'
                f'Senha: {senha}\n'
                f"Altere sua senha depois do primeiro acesso."
            )
        )

        return Response({"message":"Usuário criado com sucesso!", "id":usuario.id, "status": status.HTTP_201_CREATED})

    def put(self, request, id):
        usuario = get_object_or_404(CustomUser, pk=id)
        data = request.data.copy()
        operacao = data.get("operacao")
       
        
        if operacao in ['adicionar', 'remover']:
            try:
                saldo = int(data.get("saldo", 0))
            except (TypeError, ValueError):
                return Response({"erro": "Saldo inválido."}, status=status.HTTP_400_BAD_REQUEST)

            if operacao == 'adicionar':
                usuario.pontuacao += saldo
                usuario.saldo += saldo

            elif operacao == 'remover':
                
                usuario.pontuacao -= saldo
                usuario.saldo -= saldo

            usuario.save()
            return Response({"status": status.HTTP_200_OK})
        
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
    
class PrimeiroAcessoSenhaView(APIView):
    def post(self, request, id):
        senha = request.data.get('senha')
        confirmar_senha = request.data.get('confirmarSenha')

        if not senha or not confirmar_senha:
            return Response({"erro": "Ambas as senhas são obrigatórias."}, status=status.HTTP_400_BAD_REQUEST)

        if senha != confirmar_senha:
            return Response({"erro": "As senhas não coincidem."}, status=status.HTTP_400_BAD_REQUEST)

        usuario = get_object_or_404(CustomUser, pk=id)
        usuario.password = make_password(senha)
        usuario.primeiroAcesso = False
        usuario.save()
        logout(request)
        return Response({"mensagem": "Senha atualizada com sucesso."}, status=status.HTTP_200_OK)


class Login(APIView):
    permission_classes = [AllowAny] 
    def post(self, request):
        nome = request.data.get('nome')
        senha = request.data.get('senha')
        
        user = authenticate(username=nome, password=senha)
        if user is not None:
            login(request, user)
            return Response({
                'is_adm': user.is_adm
            }, status=status.HTTP_200_OK)
        
        return Response({'error': 'Credenciais inválidas'}, status=status.HTTP_401_UNAUTHORIZED)
        
class Logout(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        logout(request)
        return Response({"status": status.HTTP_200_OK, "mensagem": "Logout realizado com sucesso"})

class GetDadosUsuarioLogado(APIView):
    permission_classes = [IsAuthenticated]
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
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        campanha = serializer.save()

        # Filtra quem deve receber (aqui: todos usuários ativos)
        users = CustomUser.objects.filter(is_active=True)

        # Monta objetos Notificacao (não gravados ainda)
        notifs = [
            Notificacao(
                titulo=f"Nova campanha!",
                mensagem=f"A campanha de {campanha.nome} começou!",  # corta se for muito grande
                idUsuario=u
            )
            for u in users
        ]

        # Cria em massa no DB
        Notificacao.objects.bulk_create(notifs)

class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer
    permission_classes = [IsAuthenticated]

class DesafioViewSet(viewsets.ModelViewSet):
    queryset = Desafio.objects.all()
    serializer_class = DesafioSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        desafio = serializer.save()

        users = CustomUser.objects.filter(is_active=True)

        notifs = [
            Notificacao(
                titulo=f"Novo desafio!",
                mensagem=f"O desafio de {desafio.nome} começou!",
                idUsuario=u
            )
            for u in users
        ]

        Notificacao.objects.bulk_create(notifs)

class CompraViewSet(viewsets.ModelViewSet):
    queryset = Compra.objects.all()
    serializer_class = CompraSerializer
    permission_classes = [IsAuthenticated]

class ItensCompraViewSet(viewsets.ModelViewSet):
    queryset = ItensCompra.objects.all()
    serializer_class = ItensCompraSerializer
    permission_classes = [IsAuthenticated]

class CadastrarCompraView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        dadosCompra = request.data.get('compra')
        itensCompra = request.data.get('itens')
        usuario_id = request.user.id
        # adiciona o id do usuário ao dadosCompra
        dadosCompra['idUsuario'] = usuario_id

        try:
            with transaction.atomic():
                # --- 1. Verificação de Saldo do Usuário ---
                usuario = CustomUser.objects.select_for_update().get(id=usuario_id)
                total_custo = dadosCompra['total']
                if usuario.saldo < total_custo:
                    # Retorno idêntico ao original
                    return Response({"error": "Usuário não tem saldo suficiente.", "status":status.HTTP_400_BAD_REQUEST})

                # --- 2. Verificação de Estoque dos Produtos ---
                erros = []
                produtos_a_serem_atualizados = []
                for item in itensCompra:
                    # Trava a linha do produto no banco de dados para evitar condição de corrida
                    produto = Produto.objects.select_for_update().get(id=item['idProduto'])
                    if produto.quantidade < item['qtdProduto']:
                        erros.append(f"Produto {produto.nome} não tem quantidade suficiente.")
                    else:
                        # Prepara o produto para a atualização
                        produto.quantidade -= item['qtdProduto']
                        produtos_a_serem_atualizados.append(produto)
                
                if erros:
                    # Retorno idêntico ao original
                    return Response({"error": erros, "status":status.HTTP_400_BAD_REQUEST})

                # --- 3. Criação da Compra ---
                compraSerializer = CompraSerializer(data=dadosCompra)
                if compraSerializer.is_valid():
                    compra = compraSerializer.save()
                else:
                    # Retorno idêntico ao original
                    return Response(compraSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

                # --- 4. Criação dos Itens da Compra e Atualização do Estoque ---
                erros_itens = []
                for item in itensCompra:
                    item['idCompra'] = compra.id
                    itemSerializer = ItensCompraSerializer(data=item)
                    if itemSerializer.is_valid():
                        itemSerializer.save()
                    else:
                        erros_itens.append(itemSerializer.errors)
                
                if erros_itens:
                     # A transação será revertida, mas mantemos o retorno original
                    return Response(erros_itens, status=status.HTTP_400_BAD_REQUEST)

                # Se tudo correu bem, salva as alterações nos produtos
                for produto in produtos_a_serem_atualizados:
                    produto.save()

                # --- 5. Atualização do Saldo do Usuário ---
                usuario.saldo -= total_custo
                usuario.save()

        except Produto.DoesNotExist:
            return Response({"error": "Um dos produtos não foi encontrado.", "status": status.HTTP_404_NOT_FOUND})
        except Exception as e:
            # Captura outras exceções para evitar que a aplicação quebre
            return Response({"error": f"Ocorreu um erro inesperado: {str(e)}", "status": status.HTTP_500_INTERNAL_SERVER_ERROR})
        
        # Retorno de sucesso idêntico ao original
        return Response({"message": "Compra e itens criados com sucesso!", "status": status.HTTP_201_CREATED})
 
class HistoricoSaldoUsuarioView(APIView):
    permission_classes = [IsAuthenticated]
    """Retorna as últimas 5 alterações de saldo do usuário logado"""
    def get(self, request):
        usuario = request.user
        serializer = UsuarioComHistoricoSerializer(usuario)
        return Response(serializer.data, status=status.HTTP_200_OK)

class HistoricoSaldoPorIdView(APIView):
    permission_classes = [IsAuthenticated]
    """Retorna as últimas 5 alterações de saldo de um usuário pelo ID"""
    def get(self, request, id):
        usuario = get_object_or_404(CustomUser, pk=id)
        serializer = UsuarioComHistoricoSerializer(usuario)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class DesenvolvedoresViewSet(viewsets.ModelViewSet):
    queryset = Desenvolvedores.objects.all()
    serializer_class = DesenvolvedoresSerializer
    permission_classes = [IsAuthenticated]

class NotificacaoViewSet(viewsets.ModelViewSet):
    queryset = Notificacao.objects.all()
    serializer_class = NotificacaoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        user_id = self.request.query_params.get('user_id')
        if user_id:
            qs = qs.filter(idUsuario_id=user_id)
            qs = qs[:3]
        return qs
    
class NonAdminActiveUsersAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        users = CustomUser.objects.filter(
            is_active=True,
            is_adm=False
        ).values('id', 'first_name', 'email', 'username', 'saldo')
        return Response(list(users), status=status.HTTP_200_OK)
   

load_dotenv()

CustomUser = get_user_model() 
    
class ResetUserPasswordView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, user_id):
        if not request.user.is_authenticated or not request.user.is_adm:
            return Response({'error': 'Acesso negado'}, status=status.HTTP_403_FORBIDDEN)

        try:
            usuario = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response({'error': 'Usuário não encontrado'}, status=status.HTTP_404_NOT_FOUND)

        nova_senha = ''.join(random.choices(string.ascii_letters + string.digits, k=10))

        usuario.set_password(nova_senha)
        usuario.save()

        try:
            yag = yagmail.SMTP(
            user=os.getenv("EMAIL_USER"),
            password=os.getenv("EMAIL_PASSWORD"),
            host=os.getenv("EMAIL_HOST"),
            port=int(os.getenv("EMAIL_PORT", 587)),
            smtp_starttls=True,
            smtp_ssl=False
        )

            yag.send(
                to=usuario.username,  # ou usuario.email, se for o caso
                subject='[Digicoin] Sua senha foi redefinida',
                contents=(
                    f'Olá {usuario.first_name},\n\n'
                    f'Você é uma rata\n'
                    f'Por Favor vamos fazer cookies\n\n'
                    f'Se declare para o vitor tmb \n\n'
                    f'Atenciosamente,\nEquipe Digicoin'
                )
            )

        except Exception as e:
            return Response({'error': f'Erro ao enviar e-mail: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
                    'message': 'Senha redefinida e e-mail enviado com sucesso!',
                    'user_id': usuario.id,
                    'email_enviado_para': usuario.username
                }, status=status.HTTP_200_OK)
        
        
class CriacaoDeUsuariosEmMassaAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request, *args, **kwargs):
        print("API 'CriacaoDeUsuariosEmMassaAPIView' foi chamada.")
        serializer = CsvUploadSerializer(data=request.data)
        
        if serializer.is_valid():
            print("Serializer é válido. Dados recebidos.")
            csv_file = serializer.validated_data['csv_file']
            
            if not csv_file.name.endswith('.csv'):
                print(f"Erro: O arquivo '{csv_file.name}' não é um CSV.")
                return Response({'error': 'O arquivo deve ser um CSV.'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                file_data = csv_file.read().decode('utf-8-sig')
                csv_reader = csv.reader(file_data.splitlines(), delimiter=';')
                
                print("Lendo o cabeçalho do CSV...")
                next(csv_reader)

                created_users_count = 0
                processed_lines_count = 0
                skipped_users = []

                print("Iniciando o loop de processamento do CSV...")
                for i, row in enumerate(csv_reader):
                    processed_lines_count += 1
                    print(f"--- Processando linha {processed_lines_count}: {row}")
                    try:
                        # Assumindo a ordem das colunas no CSV: username, first_name, ra
                        username = row[0]
                        first_name = row[1]
                        ra = row[2]
                        
                        password = ''.join(random.choices(string.ascii_letters + string.digits, k=12))
                        print(f"Dados extraídos: username={username}, first_name={first_name}, ra={ra}")

                        if not CustomUser.objects.filter(username=username).exists():
                            print(f"Usuário '{username}' não encontrado. Iniciando a criação...")
                            # Criação do usuário
                            usuario = CustomUser.objects.create_user(
                                username=username,
                                first_name=first_name,
                                ra=ra,
                                password=password
                            )
                            created_users_count += 1
                            print(f"Usuário '{username}' criado com sucesso.")

                            # Envio de e-mail
                            try:
                                print(f"Iniciando o envio de e-mail para '{usuario.username}'...")
                                yag = yagmail.SMTP(
                                    user=os.getenv("EMAIL_USER"),
                                    password=os.getenv("EMAIL_PASSWORD"),
                                    host=os.getenv("EMAIL_HOST"),
                                    port=int(os.getenv("EMAIL_PORT")),
                                    smtp_starttls=True,
                                    smtp_ssl=False
                                )
                                yag.send(
                                    to=usuario.username,
                                    subject='Bem vindo ao Sistema Digicoin',
                                    contents=(
                                        f'Nome: {usuario.first_name}\n'
                                        f'RA: {ra}\n'
                                        f'Login: {usuario.username}\n'
                                        f'Senha: {password}\n'
                                        f'Altere sua senha depois do primeiro acesso.'
                                    )
                                )
                                print(f"E-mail enviado para '{usuario.username}' com sucesso.")
                            except Exception as email_e:
                                print(f"Erro ao enviar e-mail para {usuario.username}: {email_e}")
                                skipped_users.append(f"Erro ao enviar e-mail para {username}: {email_e}")
                                
                        else:
                            print(f"Usuário '{username}' já existe. Pulando a criação.")
                            skipped_users.append(f"Usuário {username} já existe e não foi criado.")
                            
                    except (IndexError, ValueError) as e:
                        print(f"Erro ao processar a linha {processed_lines_count}: Formato incorreto. Erro: {e}")
                        skipped_users.append(f"Erro na linha {processed_lines_count}: Formato incorreto. Erro: {e}")
                        continue
                
                response_message = f"{created_users_count} usuários foram criados com sucesso."
                if skipped_users:
                    response_message += " Observações: " + " | ".join(skipped_users)
                
                print(f"Finalizando o processamento. Total de usuários criados: {created_users_count}")
                print(f"Mensagem de resposta: {response_message}")

                return Response(
                    {'message': response_message},
                    status=status.HTTP_201_CREATED
                )

            except Exception as e:
                print(f"Erro geral no bloco 'try': {e}")
                return Response({'error': f'Ocorreu um erro: {e}'}, status=status.HTTP_400_BAD_REQUEST)
        
        else:
            print(f"Erro: Serializer não é válido. Erros: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class ZerarPontuacaoAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        updated_count = CustomUser.objects.filter(is_active=True, is_adm=False).update(pontuacao=0)
        return Response({'message': f'Pontuação zerada para {updated_count} usuários.'}, status=status.HTTP_200_OK)	

def modelo_csv(request):
    response = HttpResponse(
        "username;first_name;ra;\n",
        content_type='text/csv'
    )
    response['Content-Disposition'] = 'attachment; filename="modelo_usuarios.csv"'
    return response
