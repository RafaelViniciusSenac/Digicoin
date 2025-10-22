function aplicarMascaraPontuacaoElemento(elemento) {
    let valor = elemento.textContent.trim().replace(/\D/g, "");
    valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    elemento.textContent = valor;
}


function aplicarMascaraPontuacaoInput(input) {
    input.addEventListener("input", function () {

        let valor = input.value.replace(/\D/g, "");


        valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

        input.value = valor; 
    });
}


function aplicarMascaraPontuacaoInputInicial(input) {
    function formatar() {
        let valor = input.value.replace(/\D/g, "");
        valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        input.value = valor;
    }

    formatar();

    input.addEventListener("input", formatar);
}

document.addEventListener("DOMContentLoaded", function() {
    const spansPontuacao = document.querySelectorAll(".pontuacao");
    spansPontuacao.forEach(el => aplicarMascaraPontuacaoElemento(el));

    const inputsPontuacao = document.querySelectorAll(".pontuacao-input-pontual");
    inputsPontuacao.forEach(input => aplicarMascaraPontuacaoInput(input));

    const inputsPontuacaoInicial = document.querySelectorAll(".pontuacao-input-pontualInicial");
    inputsPontuacaoInicial.forEach(input => aplicarMascaraPontuacaoInputInicial(input));
});