document.addEventListener("DOMContentLoaded", function(){
    
    async function GetUserLogado(){
        const response = await apiRequest('/api/GetDadosUsuarioLogado')
        const nomeUsuario = document.getElementById('nomeUsuario')
        const saldo = document.getElementById('saldo')
        nomeUsuario.innerHTML = response.first_name
        saldo.innerHTML = response.saldo
        
        localStorage.setItem('userId', response.id) 
    }
    
    GetUserLogado()
    
    async function GetNotificacao(userId){
        const response = await apiRequest(`/api/notificacao/?user_id=${userId}`)
        const notificacoes = document.getElementById('notificacoes-menuUser')
        
        if (response.results && response.results.length > 0) {
            
            const sino = document.getElementById('notificacaoOff');
            sino.src = sino.dataset.sinoAtivo;
    
            // renderiza notificações
            notificacoes.innerHTML = ''; // limpa antes de inserir
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

    notificacaoOff.addEventListener('click', () => {
        if (notificacoes.style.display === 'block') {
            notificacoes.style.display = 'none'
            const sino = document.getElementById('notificacaoOff');
            sino.src = sino.dataset.sinoDesativo;
        }
        else
            notificacoes.style.display = 'block'
             
    })

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

    document.getElementById("sairMobile").addEventListener("click", async () => {
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

    document.getElementById("historicoCompraMobile").addEventListener("click", () => {
        window.location.href = "/historicoCompra";
    });


    const perfilUsuario = document.getElementById('perfilUsuario')

    document.getElementById("visualizarPerfil").addEventListener("click", () => {
        perfilUsuario.showModal();
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

    // fechar menu pelo botão flecha
    flechaEsquerda.addEventListener('click', () => {
        fecharMenu()
    })

    function fecharMenu() {
        menuMobile.style.display = 'none'
        imgGroup.style.display = 'block'
        flechaEsquerda.style.display = 'none'

        // remove o listener de clique fora
        document.removeEventListener('click', clickFora)
    }


    function clickFora(e) {
        if (!menuMobile.contains(e.target) && !imgGroup.contains(e.target) && !flechaEsquerda.contains(e.target)) {
            fecharMenu()
        }
    }

    // 1. Seleciona os elementos que vamos usar uma vez só
    const dropdownMenuMobile = document.getElementById('dropdownMenuMobile');
    const imgPerfil = document.getElementById('imgPerfil');
    // Certifique-se que o ID da sua flecha mobile é 'imgFlechaPerfil'
    const imgFlechaPerfil = document.getElementById('imgFlechaPerfil'); 

    // 2. Funções que serão usadas pelos eventos
    function toggleMenu() {
        dropdownMenuMobile.classList.toggle('aberto');
        imgFlechaPerfil.classList.toggle('aberto');
    }

    function fecharMenuSeClicarFora(event) {
        if (
            dropdownMenuMobile.classList.contains('aberto') &&
            !dropdownMenuMobile.contains(event.target) &&
            !imgPerfil.contains(event.target) &&
            !imgFlechaPerfil.contains(event.target)
        ) {
            toggleMenu(); // Fecha o menu e gira a flecha de volta
        }
    }

    // 3. Função principal que gerencia os eventos
    function gerenciarEventListenersMobile() {
        // Se a tela for pequena (mobile)
        if (window.innerWidth < 1000) {
            imgPerfil.addEventListener('click', toggleMenu);
            imgFlechaPerfil.addEventListener('click', toggleMenu);
            document.addEventListener('click', fecharMenuSeClicarFora);
        } 
        // Se a tela for grande (desktop)
        else {
            // REMOVE a funcionalidade de clique dos elementos
            imgPerfil.removeEventListener('click', toggleMenu);
            imgFlechaPerfil.removeEventListener('click', toggleMenu);
            document.removeEventListener('click', fecharMenuSeClicarFora);

            // Garante que o menu feche caso a tela seja redimensionada enquanto ele está aberto
            dropdownMenuMobile.classList.remove('aberto');
            imgFlechaPerfil.classList.remove('aberto');
        }
    }

    // 4. Ativação do código
    // Adiciona um "escutador" para o evento de redimensionar a janela
    window.addEventListener('resize', gerenciarEventListenersMobile);

    // Executa a função uma vez quando a página carrega para definir o estado inicial
    gerenciarEventListenersMobile();

    // --- Fim do Bloco de Código do Menu ---
})

