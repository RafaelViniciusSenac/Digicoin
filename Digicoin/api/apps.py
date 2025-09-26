from django.apps import AppConfig
from django.conf import settings

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'




# class ApiConfig(AppConfig):
#     default_auto_field = 'django.db.models.BigAutoField'
#     name = 'api'

#     def ready(self):
#         if settings.DEBUG:  # Para garantir que rode apenas em modo de debug se desejar
#             print("Agendando a tarefa de desativação de campanhas na inicialização do sistema.")
#             # Importação local para evitar erros de importação cíclica
#             from django_q.tasks import async_task
#             from .tasks import desativar_campanhas_expiradas

#             # Agenda a tarefa para ser executada imediatamente
#             async_task(desativar_campanhas_expiradas)