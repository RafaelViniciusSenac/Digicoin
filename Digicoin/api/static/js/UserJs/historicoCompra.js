document.addEventListener('DOMContentLoaded', function() {
    const sortIcons = document.querySelectorAll('.historicoCompraIconeSort');

    sortIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const isAsc = icon.classList.contains('historicoCompraSortAsc');
            if (isAsc) {
                icon.classList.remove('historicoCompraSortAsc');
                icon.classList.add('historicoCompraSortDesc');
            } else {
                icon.classList.remove('historicoCompraSortDesc');
                icon.classList.add('historicoCompraSortAsc');
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