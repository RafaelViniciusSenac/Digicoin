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
router.register('desenvolvedores', DesenvolvedoresViewSet)
router.register('notificacao', NotificacaoViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/user/', User.as_view(), name='usuarios'),
    path('api/user/<int:id>', User.as_view(), name="usuarioDetalhe"),
    path('api/login/', Login.as_view(), name='loginAPI'),
    path('api/logout/', Logout.as_view(), name='logout'),
    path('api/cadastrarCompra/', CadastrarCompraView.as_view(), name='CadastrrarCompra'),
    path('api/GetDadosUsuarioLogado', GetDadosUsuarioLogado.as_view(), name='GetDadosUsuarioLogado'),
    path('api/user/historico-saldo/', HistoricoSaldoUsuarioView.as_view(), name='historico-saldo-usuario'),
    path('api/user/<int:id>/historico-saldo/', HistoricoSaldoPorIdView.as_view(), name='historico-saldo-por-id'),
    path('api/usuario/<int:id>/primeiro-acesso/', PrimeiroAcessoSenhaView.as_view(), name='primeiro_acesso_senha'),
    path('', login, name="login"),
    path('home/', home, name="home"),
    path('primeiroAcesso', primeiroAcesso, name="primeiroAcesso"),
    path('historicoCompra', historicoCompra, name="historicoCompra"),
    path('perfilUsuario', perfilUsuario, name="perfilUsuario"),
    path('listaProdutos', listaProdutos, name="listaProdutos"),
    path('cadastrarDesafio', cadastrarDesafio, name="cadastrarDesafio"),
    path('ranking', ranking, name="ranking"),
    path('listaDeUsuarios', listaDeUsuarios, name="listaDeUsuarios"),
    path('CampanhaAtivas/', desafiosCampanhaAtivas, name="CampanhaAtivas"),
    path('desafiosCampanha/<int:campanha_id>/', desafiosCampanha, name="desafiosCampanha"),
    path('listaDePedidos', listaDePedidos, name='listaDePedidos'),
    path('carrinho/', carrinho, name="carrinho"),
    path('relatorio/', relatorio, name="relatorio"),
    path('campanhas/', campanhas, name="campanhas"),
    path('listaEstoque/', listaEstoque, name='listaEstoque'),
    path('cadastrarUsuario/', cadastrarUsuario, name='cadastrarUsuario'),
    path('editarUsuario/<int:id>/', editarUsuario, name='editarUsuario'),
    path('adicionarMoedas/', adicionarMoedas, name='adicionarMoedas'), #tem que tirar
    path('listaDeDesafios/', listaDeDesafios, name='listaDeDesafios'),
    path('teste/', teste, name='teste'),
    path('api/exportar_vendas_excel/', exportar_vendas_excel, name='exportar_vendas_excel'),
    path('api/exportar_produtos_mais_vendidos_excel/', exportar_produtos_mais_vendidos_excel, name='exportar_produtos_mais_vendidos_excel'),
    path('api/exportar_usuarios_com_mais_moedas_excel/', exportar_usuarios_com_mais_moedas_excel, name='exportar_usuarios_com_mais_moedas_excel'),
    path('api/desenvolvedores/', Desenvolvedores, name='desenvolvedores'),
    path('api/notificacao/', Notificacao, name='notificacoes'),

]
