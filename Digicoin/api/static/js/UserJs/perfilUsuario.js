document.addEventListener("DOMContentLoaded", function(){
    
    
    async function GetUserLogado(){
        const response = await apiRequest('/api/GetDadosUsuarioLogado')
        // console.log(response.id);
        return response.id
        
    }
    


    async function retornarSaldoHistorico(){
        var id = await GetUserLogado();
        
        const response = await apiRequest(`/api/user/${id}`)
        var nome = response.first_name
        var saldo = response.saldo
        document.getElementById('saldoPopUp').innerHTML = saldo
        document.getElementById('nomeUsuarioPopUp').innerHTML = nome

        const response2 = await apiRequest('/api/user/historico-saldo/')
        var historico = response2.ultimas_alteracoes
        var historicoPopUp = document.getElementById('historicoPopUp')

        historico.forEach(element => {
            if (element.diferenca < 0){
                historicoPopUp.innerHTML += `<p><i class="fa-solid fa-dollar-sign" ></i> Saldo Removido: <span id="dgs" >DG$</span><span id="valor" > ${element.diferenca} </span></p>`
            }
            else{
                historicoPopUp.innerHTML += `<p><i class="fa-solid fa-dollar-sign" ></i> Saldo Adicinado: <span id="dgs" >DG$</span><span id="valor" > ${element.diferenca}  </span></p>`
            }
        });

    }

    retornarSaldoHistorico();
    
   


})

