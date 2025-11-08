from django.core.management.base import BaseCommand
from ...models import CustomUser

# Lista de administradores a serem criados
ADMINS_TO_CREATE = [
    {'username': 'Adm-01',  'password': 'Digix4793'}, 
    {'username': 'Adm-02',  'password': 'Digix8516'}, 
    {'username': 'Adm-03',  'password': 'Digix1029'}, 
    {'username': 'Adm-04',  'password': 'Digix3854'}, 
    {'username': 'Adm-05',  'password': 'Digix9617'}, 
    {'username': 'Adm-06',  'password': 'Digix8705'}, 
    {'username': 'Adm-07',  'password': 'Digix4093'}, 
    {'username': 'Adm-08',  'password': 'Digix2576'}, 
    {'username': 'Adm-09',  'password': 'Digix0628'}, 
    {'username': 'Adm-10',  'password': 'Digix7041'}, 
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