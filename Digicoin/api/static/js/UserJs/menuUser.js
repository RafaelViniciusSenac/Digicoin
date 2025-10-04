document.addEventListener("DOMContentLoaded", function(){
    
    async function GetUserLogado(){
// ... (código GetUserLogado inalterado)
        const response = await apiRequest('/api/GetDadosUsuarioLogado')
        const nomeUsuario = document.getElementById('nomeUsuario')
        const saldo = document.getElementById('saldo')
        nomeUsuario.innerHTML = response.first_name
        saldo.innerHTML = response.saldo
        
        localStorage.setItem('userId', response.id) 
    }
    
    GetUserLogado()
    
    async function GetNotificacao(userId){
// ... (código GetNotificacao inalterado)
        const response = await apiRequest(`/api/notificacao/?user_id=${userId}`)
        const notificacoes = document.getElementById('notificacoes-menuUser')
        
        if (response.results && response.results.length > 0) {
            
            // ESTA PARTE GARANTE QUE A COR DO SINO SEJA ATIVADA UMA ÚNICA VEZ AO CARREGAR
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
    const dropdownMenu = document.getElementById("dropdownMenu");
    const imgFlecha = document.getElementById('imgFlecha')
    const imgFlechaCima = document.getElementById('imgFlechaCima')
    const flechaDropdownContainer = document.querySelector('.flechaDropdownContainer');


    // FUNÇÃO PARA FECHAR O DROPDOWN DE PERFIL
    function fecharDropdownPerfil() {
        dropdownMenu.style.display = 'none'; // esconde o menu
        imgFlecha.style.display = 'block';
        imgFlechaCima.style.display = 'none';
    }

    // FUNÇÃO PARA FECHAR AS NOTIFICAÇÕES (APENAS ESCONDE O MENU)
    function fecharNotificacoes() {
        notificacoes.style.display = 'none'
    }


    // LÓGICA DO SINO DE NOTIFICAÇÕES (AGORA APENAS INVERTE O ESTADO E MUDA O ICONE AO FECHAR)
    notificacaoOff.addEventListener('click', (event) => {
        event.stopPropagation(); 
        
        const sino = document.getElementById('notificacaoOff');
        
        if (notificacoes.style.display === 'block') {
            // FECHA: Esconde o menu e reseta a cor do sino
            fecharNotificacoes(); 
            sino.src = sino.dataset.sinoDesativo; // <--- O sino é resetado APENAS quando é FECHADO pelo clique
        } else {
            // ABRE: fecha o outro e mostra este (NÃO TOCA NA COR, que já deve estar ativa pelo GetNotificacao)
            fecharDropdownPerfil(); 
            notificacoes.style.display = 'block'
        }
    })


    // LÓGICA DA FLECHA PARA DROPDOWN (NÃO TOCA NO SINO)
    imgFlecha.addEventListener('click', (event) => {
        event.stopPropagation(); 
        
        // Antes de abrir o perfil, FECHA as notificações sem mudar a cor do sino
        fecharNotificacoes(); 
        
        imgFlecha.style.display = 'none';
        imgFlechaCima.style.display = 'block';
        dropdownMenu.style.display = 'flex'; 
    });
    
    imgFlechaCima.addEventListener('click', (event) => {
        event.stopPropagation(); 
        fecharDropdownPerfil(); 
    });

    // MANTÉM A LÓGICA DE FECHAR AO CLICAR FORA (COM RESET DO SINO)
    document.addEventListener('click', function(event) {
        if (!flechaDropdownContainer.contains(event.target)) {
            if (dropdownMenu.style.display === 'flex') {
                fecharDropdownPerfil();
            }
            if (notificacoes.style.display === 'block') {
                 // Quando fecha ao clicar fora, também reseta o sino para "desativo"
                 fecharNotificacoes();
                 const sino = document.getElementById('notificacaoOff');
                 sino.src = sino.dataset.sinoDesativo;
            }
        }
    });

    function getCookie(name) {
// ... (código getCookie inalterado)
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
// ... (código sair inalterado)
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
// ... (código sairMobile inalterado)
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
// ... (código historicoCompra inalterado)
        window.location.href = "/historicoCompra";
    });

    document.getElementById("historicoCompraMobile").addEventListener("click", () => {
// ... (código historicoCompraMobile inalterado)
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
// ... (código imgGroup click inalterado)
    menuMobile.style.display = 'flex'
    imgGroup.style.display = 'none'
    flechaEsquerda.style.display = 'block'


    setTimeout(() => {
        document.addEventListener('click', clickFora)
    }, 0)
})

// fechar menu pelo botão flecha
flechaEsquerda.addEventListener('click', () => {
// ... (código flechaEsquerda click inalterado)
    fecharMenu()
})

function fecharMenu() {
// ... (código fecharMenu inalterado)
    menuMobile.style.display = 'none'
    imgGroup.style.display = 'block'
    flechaEsquerda.style.display = 'none'

    // remove o listener de clique fora
    document.removeEventListener('click', clickFora)
}


function clickFora(e) {
// ... (código clickFora inalterado)
    if (!menuMobile.contains(e.target) && !imgGroup.contains(e.target) && !flechaEsquerda.contains(e.target)) {
        fecharMenu()
    }
}

const dropdownMenuMobile = document.getElementById('dropdownMenuMobile')
const imgPerfil = document.getElementById('imgPerfil')

if (window.innerWidth < 1000) {
// ... (código mobile inalterado)
    imgPerfil.addEventListener('click', () => {
        if (dropdownMenuMobile.style.display === 'none') {
            dropdownMenuMobile.style.display = 'flex'
        } else {
            dropdownMenuMobile.style.display = 'none'
        }
    })

    document.addEventListener('click', (e) => {
        if (
            dropdownMenuMobile.style.display === 'flex' &&
            !dropdownMenuMobile.contains(e.target) && 
            !imgPerfil.contains(e.target) 
        ) {
            dropdownMenuMobile.style.display = 'none'
        }
    })
}
    
      

})