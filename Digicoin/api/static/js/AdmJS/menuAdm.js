

function exibirMenu() {
    var lateral = document.getElementById('lateral')
    var groupAdmin = document.getElementById('groupAdmin')
    if (lateral.classList.contains('displayOff-menuAdm')) {
        lateral.classList.remove('displayOff-menuAdm')
        lateral.classList.add('displayOn-menuAdm')
        groupAdmin.classList.add('visibility-menuAdm')
      }
     
  }

function esconderMenu(){
    var lateral = document.getElementById('lateral')
    var groupAdmin = document.getElementById('groupAdmin')
    if (lateral.classList.contains('displayOn-menuAdm')){
        lateral.classList.add('displayOff-menuAdm')
        lateral.classList.remove('displayOn-menuAdm') 
        groupAdmin.classList.remove('visibility-menuAdm')
    }

}

document.getElementById('arrowLeft').addEventListener('click', esconderMenu)
document.getElementById('groupAdmin').addEventListener('click', exibirMenu)

document.addEventListener('click', function(event) {
    var lateral = document.getElementById('lateral');
    var groupAdmin = document.getElementById('groupAdmin');

    // Verifica se o clique foi fora do menu e do botão que ativa o menu
    if (
        !lateral.contains(event.target) &&
        !groupAdmin.contains(event.target)
    ) {
        esconderMenu();
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
