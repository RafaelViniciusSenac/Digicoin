document.addEventListener("DOMContentLoaded", function() {

    async function GetUserLogado() {
        const response = await apiRequest('/api/GetDadosUsuarioLogado')
        const nomeUsuario = document.getElementById('nomeUsuario')
        const saldo = document.getElementById('saldo')
        nomeUsuario.innerHTML = response.first_name
        saldo.innerHTML = response.saldo

        localStorage.setItem('userId', response.id)
    }

    GetUserLogado()

    async function GetNotificacao(userId) {
        const response = await apiRequest(`/api/notificacao/?user_id=${userId}`)
        const notificacoes = document.getElementById('notificacoes-menuUser')

        if (response.results && response.results.length > 0) {
            const sino = document.getElementById('notificacaoOff');
            sino.src = sino.dataset.sinoAtivo;

            notificacoes.innerHTML = '';
            response.results.forEach(info => {
                notificacoes.innerHTML += `
                    <div class="notificacao" id="notificacao-menuUser">
                        <h2>${info.titulo}</h2>
                        <p>${info.mensagem}</p>
                    </div>
                `;
            });
        }
    }
    const userId = localStorage.getItem('userId')
    GetNotificacao(userId)

    const notificacaoOff = document.getElementById('notificacaoOff')
    const notificacoes = document.getElementById('notificacoes-menuUser')
    const dropdownMenu = document.getElementById("dropdownMenu");
    const imgFlecha = document.getElementById('imgFlecha')
    const imgFlechaCima = document.getElementById('imgFlechaCima')
    const flechaDropdownContainer = document.querySelector('.flechaDropdownContainer');

    function fecharDropdownPerfil() {
        dropdownMenu.style.display = 'none';
        imgFlecha.style.display = 'block';
        imgFlechaCima.style.display = 'none';
    }

    function fecharNotificacoes() {
        notificacoes.style.display = 'none'
    }

    notificacaoOff.addEventListener('click', (event) => {
        event.stopPropagation();
        const sino = document.getElementById('notificacaoOff');
        if (notificacoes.style.display === 'block') {
            fecharNotificacoes();
            sino.src = sino.dataset.sinoDesativo;
        } else {
            fecharDropdownPerfil();
            notificacoes.style.display = 'block'
        }
    })

    imgFlecha.addEventListener('click', (event) => {
        event.stopPropagation();
        fecharNotificacoes();
        imgFlecha.style.display = 'none';
        imgFlechaCima.style.display = 'block';
        dropdownMenu.style.display = 'flex';
    });

    imgFlechaCima.addEventListener('click', (event) => {
        event.stopPropagation();
        fecharDropdownPerfil();
    });

    document.addEventListener('click', function(event) {
        if (!flechaDropdownContainer.contains(event.target)) {
            if (dropdownMenu.style.display === 'flex') {
                fecharDropdownPerfil();
            }
            if (notificacoes.style.display === 'block') {
                fecharNotificacoes();
                const sino = document.getElementById('notificacaoOff');
                sino.src = sino.dataset.sinoDesativo;
            }
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
                'X-CSRFToken': getCookie('csrftoken'),
            }
        });
        window.location.href = "/";
    });

    document.getElementById("sairMobile").addEventListener("click", async () => {
        await fetch('/api/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            }
        });
        window.location.href = "/";
    });

    document.getElementById("historicoCompra").addEventListener("click", () => {
        window.location.href = "/historicoCompra";
    });

    document.getElementById("historicoCompraMobile").addEventListener("click", () => {
        window.location.href = "/historicoCompra";
    });

    const perfilUsuario = document.getElementById('perfilUsuario')
    document.getElementById("visualizarPerfil").addEventListener("click", () => {
        perfilUsuario.showModal();
        fecharDropdownPerfil();
    })
    document.getElementById("visualizarPerfilMobile").addEventListener("click", () => {
        perfilUsuario.showModal();
    })

    const imgGroup = document.getElementById('imgGroup')
    const menuMobile = document.getElementById('menuMobile')
    const flechaEsquerda = document.getElementById('flechaEsquerda')

    imgGroup.addEventListener('click', () => {
        menuMobile.style.display = 'flex'
        imgGroup.style.display = 'none'
        flechaEsquerda.style.display = 'block'
        setTimeout(() => {
            document.addEventListener('click', clickFora)
        }, 0)
    })

    flechaEsquerda.addEventListener('click', () => {
        fecharMenu()
    })

    function fecharMenu() {
        menuMobile.style.display = 'none'
        imgGroup.style.display = 'block'
        flechaEsquerda.style.display = 'none'
        document.removeEventListener('click', clickFora)
    }

    function clickFora(e) {
        if (!menuMobile.contains(e.target) && !imgGroup.contains(e.target) && !flechaEsquerda.contains(e.target)) {
            fecharMenu()
        }
    }

    // LÓGICA MOBILE SIMPLIFICADA
    if (window.innerWidth < 1000) {
        const dropdownMenuMobile = document.getElementById('dropdownMenuMobile');
        const imgPerfil = document.getElementById('imgPerfil');
        
        imgPerfil.addEventListener('click', () => {
            if (dropdownMenuMobile.style.display === 'none' || dropdownMenuMobile.style.display === '') {
                dropdownMenuMobile.style.display = 'flex';
            } else {
                dropdownMenuMobile.style.display = 'none';
            }
        });
    
        document.addEventListener('click', (e) => {
            if (
                dropdownMenuMobile.style.display === 'flex' &&
                !dropdownMenuMobile.contains(e.target) && 
                !imgPerfil.contains(e.target) 
            ) {
                dropdownMenuMobile.style.display = 'none';
            }
        });
    }

});