async function CadastrarDesafio(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nomeDesafio-form').value;       
    const valor = document.getElementById('valorDesafio-form').value;     
    const descricao = document.getElementById('descricao-form').value;    
    const dataInicio = document.getElementById('inicioDesafio-form').value;
    const dataFim = document.getElementById('fimDesafio-form').value;      
    const idCampanha = document.getElementById('campanha-form').value;    
    const csrf = document.querySelector('[name=csrfmiddlewaretoken]').value;

    if(!nome || !valor || !dataInicio){
        alert("Preencha todos os campos corretamente.");
        return;
        
    }
    else if (dataFim < dataInicio) {
        
        alert("A data de fim deve ser maior que a data de inicio.");
        return;
    }
    else{
        const response = await apiRequest('/api/desafio/','POST',
        {
            nome: nome,
            valor: valor,
            dataInicio: dataInicio,
            descricao: descricao,
            dataFim: dataFim,
            idCampanha: idCampanha
            },{ 'X-CSRFToken': csrf }
        );
        console.log(response);    
        document.getElementById('nomeDesafio-form').value = '';
        document.getElementById('valorDesafio-form').value = '';
        document.getElementById('descricao-form').value = '';
        document.getElementById('inicioDesafio-form').value = '';
        document.getElementById('fimDesafio-form').value = '';
        document.getElementById('campanha-form').value = '';
        alert('Desafio cadastrado com sucesso!');
        window.location.reload();
    }
    
}

const criarCampanhaForm = document.getElementById('formDesafio');
criarCampanhaForm.addEventListener('submit', CadastrarDesafio);