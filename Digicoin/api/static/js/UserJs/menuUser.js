document.addEventListener("DOMContentLoaded", function(){
    async function GetUserLogado(){
        const response = await apiRequest('/api/GetDadosUsuarioLogado')
        const nomeUsuario = document.getElementById('nomeUsuario')
        const saldo = document.getElementById('saldo')
        nomeUsuario.innerHTML = response.first_name
        saldo.innerHTML = response.saldo
    }
    
    GetUserLogado()

    const dropdownMenu = document.getElementById("dropdownMenu");
    const imgFlecha = document.getElementById('imgFlecha')
    const imgFlechaCima = document.getElementById('imgFlechaCima')

    imgFlecha.addEventListener('click', () => {
        imgFlecha.style.display = 'none';
        imgFlechaCima.style.display = 'block';
        dropdownMenu.style.display = 'flex'; // mostra o menu
    });
    
    imgFlechaCima.addEventListener('click', () => {
        imgFlecha.style.display = 'block';
        imgFlechaCima.style.display = 'none';
        dropdownMenu.style.display = 'none'; // esconde o menu
    });

    document.addEventListener('click', function(event) {
        const dropdownMenu = document.getElementById("dropdownMenu");
        const imgFlecha = document.getElementById('imgFlecha');
        const imgFlechaCima = document.getElementById('imgFlechaCima');
        const flechaContainer = document.querySelector('.flechaDropdownContainer');
    
        if (
            dropdownMenu.style.display === 'flex' &&
            !flechaContainer.contains(event.target)
        ) {
            dropdownMenu.style.display = 'none';
            imgFlecha.style.display = 'block';
            imgFlechaCima.style.display = 'none';
        }
    });

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                cookie = cookie.trim();
                if (cookie.startsWith(name + '=')) {
                    cookieValue = decodeURIComponent(cookie.slice(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }


    document.getElementById("sair").addEventListener("click", async () => {
        await fetch('/api/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),  // importante se CSRF estiver ativo
            }
        });
    
        window.location.href = "/"; // ou a URL da sua tela de login
    });

    document.getElementById("historicoCompra").addEventListener("click", () => {
        window.location.href = "/historicoCompra";
    });

    const perfilUsuario = document.getElementById('perfilUsuario')

    document.getElementById("visualizarPerfil").addEventListener("click", () => {
        perfilUsuario.show();
    })


})

