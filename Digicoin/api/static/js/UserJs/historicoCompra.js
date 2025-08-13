document.addEventListener('DOMContentLoaded', function() {
    const sortIcons = document.querySelectorAll('.historico-compra-icone-sort');

    sortIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const isAsc = icon.classList.contains('historico-compra-sort-asc');
            if (isAsc) {
                icon.classList.remove('historico-compra-sort-asc');
                icon.classList.add('historico-compra-sort-desc');
            } else {
                icon.classList.remove('historico-compra-sort-desc');
                icon.classList.add('historico-compra-sort-asc');
            }
        });
    });
});


function mostrarCampoPesquisa() {
    var tipoPesquisa = document.getElementById("tipoPesquisa").value;
    var campoNome = document.getElementById("campoNome");
    var campoData = document.getElementById("campoData");
    var campoEntrega = document.getElementById("campoEntrega");
    var campoStatus = document.getElementById("campoStatus");

    campoNome.style.display = "none";
    campoData.style.display = "none";
    campoEntrega.style.display = "none";
    campoStatus.style.display = "none";

    if (tipoPesquisa === "nome") {
        campoNome.style.display = "block";
    } else if (tipoPesquisa === "data") {
        campoData.style.display = "block";
    } else if (tipoPesquisa === "entrega") {
        campoEntrega.style.display = "block";
    } else if (tipoPesquisa === "status") {
        campoStatus.style.display = "block";
    }
}