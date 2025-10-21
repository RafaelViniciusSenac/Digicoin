function aplicarMascaraPontuacaoElemento(elemento) {
    let valor = elemento.textContent.trim().replace(/\D/g, "");
    valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    elemento.textContent = valor;
}

document.addEventListener("DOMContentLoaded", function() {
    const spansPontuacao = document.querySelectorAll(".pontuacao");
    spansPontuacao.forEach(el => aplicarMascaraPontuacaoElemento(el));
});