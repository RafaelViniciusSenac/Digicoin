from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class CustomUser(AbstractUser):
    is_adm = models.BooleanField(default=False)
    ra = models.CharField(max_length=30, null=False, blank=False, default=False)
    imgPerfil = models.CharField(max_length=100, default=False)
    saldo = models.IntegerField(default=0)

class Campanha(models.Model):
    nome = models.CharField(max_length=30, null=False, blank=False)
    is_active = models.BooleanField(default=True)
    dataInicio = models.DateField(default=False)
    dafaFim = models.DateField(default=False)
    descricao = models.TextField()

class Produto(models.Model):
    nome = models.CharField(max_length=100, null=False, blank=False)
    img1 =  models.CharField(max_length=100, null=False, blank=False)
    img2 =  models.CharField(max_length=100)
    img3 =  models.CharField(max_length=100)
    valor = models.IntegerField(null=False, blank=False)
    quantidade = models.IntegerField(null=False, blank=False)
    tipo_choices = [("Físico", "Físico"), ("Virtual","Virtual")]
    tipo = models.CharField(max_length=10, choices=tipo_choices)
    is_active = models.BooleanField(default=True)
    idCampanha = models.ForeignKey(Campanha, on_delete=models.CASCADE, default=False)

class Desafio(models.Model):
    nome = models.CharField(max_length=100, null=False, blank=False)
    valor = models.IntegerField(null=False, blank=False)
    dataInicio = models.DateField(default=False)
    dafaFim = models.DateField(default=False)
    is_active = models.BooleanField(default=True)
    idCampanha = models.ForeignKey(Campanha, on_delete=models.CASCADE, default=False)

class Compra(models.Model):
    total = models.IntegerField(null=False, blank=False)
    entrega_choices = [("Retirar","Retirar"), ("Entrega","Entrega")]
    entrega = models.CharField(max_length=10, choices=entrega_choices)
    cep = models.CharField(max_length=20, default=False)
    cidade = models.CharField(max_length=20, default=False)
    estado = models.CharField(max_length=20, default=False)
    rua = models.CharField(max_length=100, default=False)
    bairro = models.CharField(max_length=100, default=False)
    numero = models.CharField(max_length=100, default=False)
    pedido_choices = [("Pendente", "Pendente"), ("Concluído","Concluído")]
    pedido = models.CharField(max_length=10, choices=pedido_choices, default='Pendente')

class ItensCompra(models.Model):
    qtdProduto = models.IntegerField(null=False, blank=False)
    idProduto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    idCompra = models.ForeignKey(Compra, on_delete=models.CASCADE)
