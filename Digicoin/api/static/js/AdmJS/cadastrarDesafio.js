async function CadastrarDesafio(event) {
  event.preventDefault();
  const popupAlert = new Popup();
  const nome = document.getElementById('nomeDesafio-form').value;
  const valor = document.getElementById('valorDesafio-form').value;
  const descricao = document.getElementById('descricao-form').value;
  const dataFim = document.getElementById('fimDesafio-form').value;
  const idCampanha = document.getElementById('campanha-form').value;
  const csrf = document.querySelector('[name=csrfmiddlewaretoken]').value;

  if (!nome || !valor || !dataFim) {
    popupAlert.show('Atenção', 'Preencha todos os campos corretamente.');
    return;
  } else {
    const response = await apiRequest(
      '/api/desafio/',
      'POST',
      {
        nome: nome,
        valor: valor,
        descricao: descricao,
        dataFim: dataFim,
        idCampanha: idCampanha,
      },
      { 'X-CSRFToken': csrf },
    );
    if (response.status == 201 || response.status == 200) {
      popupAlert.show('Atenção', 'Desafio cadastrado com sucesso.');
    }else{
      popupAlert.show('Atenção', 'Erro ao cadastrar desafio.');
      return;
    }

    console.log(response);
    document.getElementById('nomeDesafio-form').value = '';
    document.getElementById('valorDesafio-form').value = '';
    document.getElementById('descricao-form').value = '';
    document.getElementById('fimDesafio-form').value = '';
    document.getElementById('campanha-form').value = '';
    
    popupAlert.imgClosed.addEventListener('click', () => {
      window.location.reload();
    })
  }
}
const criarCampanhaForm = document.getElementById('formDesafio');
criarCampanhaForm.addEventListener('submit', CadastrarDesafio);
