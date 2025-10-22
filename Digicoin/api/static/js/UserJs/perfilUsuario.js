document.addEventListener("DOMContentLoaded", function() {

    // ======== FUNÇÕES DE MÁSCARA ========
    function aplicarMascaraPontuacaoElementoPerfil(elemento) {
        let valor = elemento.textContent.trim().replace(/[^\d.-]/g, "");
        const numero = parseFloat(valor);
        if (!isNaN(numero)) {
            const formatado = numero.toLocaleString("pt-BR", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            });
            elemento.textContent = formatado;
        }
    }

    function aplicarMascaraPontuacoesPerfil() {
        const spansPontuacao = document.querySelectorAll(".pontuacaoPerfil");
        spansPontuacao.forEach(el => aplicarMascaraPontuacaoElementoPerfil(el));
    }

    
    async function GetUserLogado() {
        const response = await apiRequest('/api/GetDadosUsuarioLogado');
        return response.id;
    }

    async function retornarSaldoHistorico() {
        var id = await GetUserLogado();
        
        const response = await apiRequest(`/api/user/${id}`);
        var nome = response.first_name;
        var saldo = response.saldo;
        document.getElementById('saldoPopUp').textContent = saldo;
        document.getElementById('nomeUsuarioPopUp').textContent = nome;

        const response2 = await apiRequest('/api/user/historico-saldo/');
        var historico = response2.ultimas_alteracoes;
        var historicoPopUp = document.getElementById('historicoPopUp');

        historicoPopUp.innerHTML = ""; 

        historico.forEach(element => {
            if (element.diferenca < 0) {
                historicoPopUp.innerHTML += `
                    <p>
                        <i class="fa-solid fa-dollar-sign"></i>
                        Saldo Removido:
                        <span id="dgs">DG$</span>
                        <span class="pontuacaoPerfil">${element.diferenca}</span>
                    </p>`;
            } else {
                historicoPopUp.innerHTML += `
                    <p>
                        <i class="fa-solid fa-dollar-sign"></i>
                        Saldo Adicionado:
                        <span id="dgs">DG$</span>
                        <span class="pontuacaoPerfil">${element.diferenca}</span>
                    </p>`;
            }
        });

        aplicarMascaraPontuacoesPerfil();
    }



    aplicarMascaraPontuacoesPerfil();

    retornarSaldoHistorico();
});
