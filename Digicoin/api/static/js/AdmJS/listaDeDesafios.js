document.addEventListener('DOMContentLoaded', () => {
  const popUpAdicionarDesafio = document.getElementById('popUpAdicionarDesafio');
  const addDesafio = document.getElementById('addDesafio');
  const iconeX = document.getElementById('iconeX');
  const barraPesquisa = document.querySelector('.barraPesquisa-listaDeDesafios input');
  const formBusca = document.querySelector('.form-busca');
  let timeoutId;
  let ultimaBusca = barraPesquisa ? barraPesquisa.value : '';

  if (barraPesquisa) {

    if (barraPesquisa.value.trim() !== '') {
      barraPesquisa.focus();
      const valorLength = barraPesquisa.value.length;
      barraPesquisa.setSelectionRange(valorLength, valorLength);
    }

    barraPesquisa.addEventListener('input', (e) => {
      clearTimeout(timeoutId);
      const valorAtual = e.target.value.trim();
    
      if (valorAtual === '' && ultimaBusca !== '') {
        window.location.href = window.location.pathname;
        return;
      }

      if (valorAtual !== '') {
        timeoutId = setTimeout(() => {
          const cursorPosition = e.target.selectionStart;
          sessionStorage.setItem('searchCursorPosition', cursorPosition);
          sessionStorage.setItem('maintainFocus', 'true');
          
          formBusca.submit();
        }, 500);
      }
      ultimaBusca = valorAtual;
    });

    barraPesquisa.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        clearTimeout(timeoutId);
        
        const valorAtual = e.target.value.trim();
        if (valorAtual === '') {
          window.location.href = window.location.pathname;
          
        } else {

          sessionStorage.setItem('maintainFocus', 'true');
          const cursorPosition = e.target.selectionStart;
          sessionStorage.setItem('searchCursorPosition', cursorPosition);
          
          formBusca.submit();
        }
      }
    });

    barraPesquisa.addEventListener('keydown', (e) => {

      if ((e.key === 'Backspace' || e.key === 'Delete') && e.target.value.length === 1) {
        setTimeout(() => {
          if (e.target.value.trim() === '') {
            window.location.href = window.location.pathname;
          }
        }, 10);
      }
    });

    if (sessionStorage.getItem('maintainFocus') === 'true') {
      barraPesquisa.focus();
      const savedPosition = sessionStorage.getItem('searchCursorPosition');

      if (savedPosition !== null) {
        const position = parseInt(savedPosition);
        const maxPosition = barraPesquisa.value.length;
        const finalPosition = Math.min(position, maxPosition);
        barraPesquisa.setSelectionRange(finalPosition, finalPosition);
      } else {

        const valorLength = barraPesquisa.value.length;
        barraPesquisa.setSelectionRange(valorLength, valorLength);

      }

      sessionStorage.removeItem('maintainFocus');
      sessionStorage.removeItem('searchCursorPosition');
    }
    ultimaBusca = barraPesquisa.value;
  }

  addDesafio.addEventListener('click', () => {
    popUpAdicionarDesafio.showModal();
  });

  iconeX.addEventListener('click', () => {
    popUpAdicionarDesafio.close();
  });

  const botoesEditar = document.querySelectorAll('.botaoEditar-listaDeDesafios');
  botoesEditar.forEach((botao) => {
    botao.addEventListener('click', () => {
      const id = botao.getAttribute('data-id');
      const dialog = document.getElementById(`popUpEditarDesafio-${id}`);
      if (dialog) {
        dialog.showModal();
      }
    });
  });

  const iconesFechar = document.querySelectorAll('.iconeX-cadastrarDesafio');
  iconesFechar.forEach((icone) => {
    icone.addEventListener('click', () => {
      const dialog = icone.closest('dialog');
      if (dialog) {
        dialog.close();
      }
    });
  });
});

// guarda o valor inicial do select quando a página carrega
let campanhaOriginal;
document.addEventListener("DOMContentLoaded", () => {
  const selectCampanha = document.getElementById("campanha");
  if (selectCampanha) {
    campanhaOriginal = selectCampanha.value;
  }
});

async function EditarDesafio(event) {
  event.preventDefault();
  const form = event.target;

  const id = form.querySelector('#id').value;
  const nomeDesafio = form.querySelector('#nomeDesafio').value;
  const valorDesafio = form.querySelector('#valorDesafio').value;
  const descricao = form.querySelector('#descricao').value;
  const campanha = form.querySelector('#campanha').value; // valor atual do select
  const dataFim = form.querySelector('#fimDesafio').value;
  const csrf = form.querySelector('[name=csrfmiddlewaretoken]').value;

  if (!nomeDesafio || !valorDesafio) {
    showPopup('Nome do desafio e valor do desafio devem ser preenchidos.', 'Erro', 'erro');
    return;
  }

  // payload básico (sem campanha)
  let payload = {
    nome: nomeDesafio,
    valor: valorDesafio,
    descricao: descricao,
    dataFim: dataFim,
  };

  // só adiciona idCampanha se o valor do select foi alterado
  if (campanha !== campanhaOriginal) {
    payload.idCampanha = campanha ? parseInt(campanha, 10) : null;
  }

  const response = await apiRequest(
    `/api/desafio/${id}/`,
    'PATCH',
    payload,
    { 'X-CSRFToken': csrf },
  );

  console.log("resposta", response);
  window.location.reload();
}




const forms = document.querySelectorAll('form[id^="formCadastrarDesafio"]');
forms.forEach((form) => {
  form.addEventListener('submit', EditarDesafio);
});

document.querySelectorAll('.btn-desativar-desafio').forEach((botao) => {
  botao.addEventListener('click', async () => {
    const desafioId = botao.getAttribute('data-id');
    const nome = document.getElementById('nomeDesafio').innerText;
    const valor = parseInt(document.getElementById('valor').innerText);
    const csrf = document.querySelector('[name=csrfmiddlewaretoken]').value;
    
    try {
      const response = await apiRequest(
        `/api/desafio/${desafioId}/`,
        'PUT',
        {
          nome: nome,
          valor: valor,
          is_active: false,
        },
        {
          'X-CSRFToken': csrf,
        },
      );

      if (response) {
        const popupAlert = new Popup(); 
        popupAlert.showPopup('Desafio desativado com sucesso!', 'Sucesso', 'sucesso');
        popupAlert.imgClosed.addEventListener("click", () => {
          window.location.reload();
        })
      } else {
        showPopup('Erro ao desativar o desafio.', 'Erro', 'erro');
      }
    } catch (err) {
      console.error('Erro ao desativar desafio:', err);
      showPopup('Erro ao desativar o desafio.', 'Erro', 'erro');
    }
  });
});

document.querySelectorAll('.btn-desativar-desafio-listaDeDesafios').forEach((botao) => {
  botao.addEventListener('click', async () => {
    const id = botao.getAttribute('data-id');
    const nomeDesafio = document.querySelector('.nomeDesafio-listaDeDesafios').textContent.trim();
    const valorDesafio = document.querySelector('.valor-listaDeDesafios').textContent.trim();

    const confirmacaoPopup = new Popup();
    const confirmacao = await confirmacaoPopup.showPopup('Tem certeza que deseja desativar este desafio?', 'Confirmação', 'confirmacao');

    if (!confirmacao) return;

    const csrf = document.querySelector('[name=csrfmiddlewaretoken]').value;

    const response = await apiRequest(
      `/api/desafio/${id}/`,
      'PUT',
      { is_active: false, nome: nomeDesafio, valor: valorDesafio },
      { 'X-CSRFToken': csrf },
    );

    if (response) {
      const popupAlert = new Popup(); 
      popupAlert.showPopup('Desafio desativado com sucesso!', 'Sucesso', 'sucesso');
      popupAlert.imgClosed.addEventListener('click', () => {
        window.location.reload();
      });
    } else {
      showPopup('Erro ao desativar o desafio.', 'Erro', 'erro');
    }
  });
});