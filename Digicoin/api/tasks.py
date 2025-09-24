import datetime
from .models import Campanha, Produto, Desafio

def desativar_campanhas_expiradas():
    hoje = datetime.date.today()

    campanhas_expiradas = Campanha.objects.filter(
        dataFim__lt=hoje, 
        is_active=True
    )

    if campanhas_expiradas.exists():
        for campanha in campanhas_expiradas:
            # Desativa os produtos relacionados
            Produto.objects.filter(idCampanha=campanha).update(is_active=False)
            # Desativa os desafios relacionados
            Desafio.objects.filter(idCampanha=campanha).update(is_active=False)
            # Desativa a campanha
            campanha.is_active = False
            campanha.save()