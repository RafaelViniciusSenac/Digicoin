from django.core.management.base import BaseCommand
from ...models import CustomUser

# Lista de administradores a serem criados
ADMINS_TO_CREATE = [
    {'username': 'admin1', 'email': 'admin1@example.com', 'password': 'password123'},
    {'username': 'admin2', 'email': 'admin2@example.com', 'password': 'password123'},
    {'username': 'admin3', 'email': 'admin3@example.com', 'password': 'password123'},
    {'username': 'admin4', 'email': 'admin4@example.com', 'password': 'password123'},
    {'username': 'admin5', 'email': 'admin5@example.com', 'password': 'password123'},
    {'username': 'admin6', 'email': 'admin6@example.com', 'password': 'password123'},
    {'username': 'admin7', 'email': 'admin7@example.com', 'password': 'password123'},
    # Adicione mais administradores aqui se precisar
]

class Command(BaseCommand):
    help = 'Cria usuários administradores com base em uma lista predefinida.'

    def handle(self, *args, **options):
        for admin_data in ADMINS_TO_CREATE:
            username = admin_data['username']

            # Verifica se o usuário já existe
            if not CustomUser.objects.filter(username=username).exists():
                try:
                    CustomUser.objects.create_user(
                        username=username,
                        email=admin_data['email'],
                        password=admin_data['password'],
                        is_adm=True,          # Sua flag customizada
                        is_staff=True,        # Permite acesso ao admin do Django
                        is_superuser=True,    # Concede todas as permissões
                        ra='0000',            # RA de exemplo
                        primeiroAcesso=False, # Como é um admin, pode ser False
                    )
                    self.stdout.write(self.style.SUCCESS(f'Usuário administrador "{username}" criado com sucesso.'))
                except Exception as e:
                    self.stderr.write(self.style.ERROR(f'Erro ao criar o usuário "{username}": {e}'))
            else:
                self.stdout.write(self.style.WARNING(f'Usuário "{username}" já existe. Ignorando a criação.'))