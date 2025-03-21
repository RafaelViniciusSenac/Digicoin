from django.urls import include, path
from .views.api_views import *
from .views.web_views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('campanha', CampanhaViewSet)
router.register('produto', ProdutoViewSet)
router.register('desafio', DesafioViewSet)
router.register('compra', CompraViewSet)
router.register('itensCompra', ItensCompraViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/user/', User.as_view(), name='usuarios'),
    path('api/user/<int:id>', User.as_view(), name="usuarioDetalhe"),
    path('api/login/', Login.as_view(), name='loginAPI'),
    path('api/GetDadosUsuarioLogado', GetDadosUsuarioLogado.as_view(), name='GetDadosUsuarioLogado'),
    path('', login, name="login"),
    path('home/', home, name="home"),
    path('primeiroAcesso', primeiroAcesso, name="primeiroAcesso"),
    path('historicoCompra', historicoCompra, name="historicoCompra"),
    path('perfilUsuario', perfilUsuario, name="perfilUsuario"),
    path('listaProdutos', listaProdutos, name="listaProdutos"),
    path('cadastrarDesafio', cadastrarDesafio, name="cadastrarDesafio"),

]
