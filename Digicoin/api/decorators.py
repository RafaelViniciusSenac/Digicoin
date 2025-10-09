from functools import wraps
from django.shortcuts import redirect
from django.urls import reverse

# Definições de rota para redirecionamento
ADMIN_DASHBOARD_ROUTE = 'listaDeUsuarios'
USER_DASHBOARD_ROUTE = 'home'
LOGIN_ROUTE_NAME = 'login'

def login_required(view_func):
    """Garante que apenas usuários logados acessem a view."""
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect(LOGIN_ROUTE_NAME)
        return view_func(request, *args, **kwargs)
    return _wrapped_view

def admin_required(view_func):
    """Garante que apenas administradores (is_adm=True) acessem a view."""
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect(LOGIN_ROUTE_NAME)
        
        if not request.user.is_adm:
            # Redireciona o usuário comum para o dashboard dele
            return redirect(USER_DASHBOARD_ROUTE)
            
        return view_func(request, *args, **kwargs)
    return _wrapped_view

def user_required(view_func):
    """Garante que apenas usuários comuns (is_adm=False) acessem a view."""
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect(LOGIN_ROUTE_NAME)
        
        if request.user.is_adm:
            # Redireciona o admin para o dashboard dele
            return redirect(ADMIN_DASHBOARD_ROUTE)
            
        return view_func(request, *args, **kwargs)
    return _wrapped_view