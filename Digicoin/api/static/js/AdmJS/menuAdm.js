
function exibirMenu() {
    var lateral = document.getElementById('lateral')

    if (lateral.classList.contains('displayOff')) {
        lateral.classList.remove('displayOff')
        lateral.classList.add('displayOn')
       
      } 
  }

function esconderMenu(){
    var lateral = document.getElementById('lateral')
    if (lateral.classList.contains('displayOn')){
        lateral.classList.add('displayOff')
        lateral.classList.remove('displayOn') 

    }

}

document.getElementById('arrowLeft').addEventListener('click', esconderMenu)
document.getElementById('groupAdmin').addEventListener('click', exibirMenu)

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
