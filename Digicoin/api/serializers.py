from rest_framework import serializers

from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'

class CampanhaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campanha
        fields = '__all__'

class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = '__all__'

class DesafioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Desafio
        fields = '__all__'

class CompraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Compra
        fields = '__all__'

class ItensCompraSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItensCompra
        fields = '__all__'

class HistoricoSaldoSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoricoSaldo
        fields = ['saldo_anterior', 'saldo_novo', 'diferenca', 'data_alteracao']

class UsuarioComHistoricoSerializer(serializers.ModelSerializer):
    ultimas_alteracoes = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'saldo', 'ultimas_alteracoes']

    def get_ultimas_alteracoes(self, obj):
        queryset = obj.historico_saldo.all()[:5]
        return HistoricoSaldoSerializer(queryset, many=True).data

class DesenvolvedoresSerializer(serializers.ModelSerializer):
    class Meta:
        model = Desenvolvedores
        fields = '__all__'
    
class NotificacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacao
        fields = '__all__'