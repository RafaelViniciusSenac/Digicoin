async function CadastrarDesafio(event) {
  event.preventDefault();
  const nome = document.getElementById('nomeDesafio-form').value;
  const valor = document.getElementById('valorDesafio-form').value;
  const descricao = document.getElementById('descricao-form').value;
  const dataFim = document.getElementById('fimDesafio-form').value;
  const idCampanha = document.getElementById('campanha-form').value;
  const csrf = document.querySelector('[name=csrfmiddlewaretoken]').value;

  if (!nome || !valor || !dataFim) {
    alert('Preencha todos os campos corretamente.');
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
    console.log(response);
    document.getElementById('nomeDesafio-form').value = '';
    document.getElementById('valorDesafio-form').value = '';
    document.getElementById('descricao-form').value = '';
    document.getElementById('fimDesafio-form').value = '';
    document.getElementById('campanha-form').value = '';
    alert('Desafio cadastrado com sucesso!');
    window.location.reload();
  }
}
const criarCampanhaForm = document.getElementById('formDesafio');
criarCampanhaForm.addEventListener('submit', CadastrarDesafio);
