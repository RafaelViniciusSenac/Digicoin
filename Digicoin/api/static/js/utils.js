async function apiRequest(url, method = 'GET', body = null, headers = {}) {
    try {
        const config = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        const response = await fetch(url, config);
        const data = await response.json();
        return {
            status: response.status,
            ok: response.ok,
            data: data
        };
    } catch (error) {
        console.error('Erro na requisição:', error);
        return {
            status: null,
            ok: false,
            data: null,
            error: error.message
        };
    }
}


function buscarEndereco(cepField, ruaField, bairroField, cidadeField, estadoField) {
    let cep = document.getElementById(cepField).value.replace(/\D/g, '');

    if (cep.length == 8) {
        console.log('Buscando endereço...');
        const popup = new Popup();
        popup.showLoadingPopup('Buscando endereço...');
        setTimeout(() => {
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                popup.hidePopup();

                if (!data.erro) {
                    document.getElementById(ruaField).value = data.logradouro;
                    document.getElementById(bairroField).value = data.bairro;
                    document.getElementById(cidadeField).value = data.localidade;
                    document.getElementById(estadoField).value = data.uf;
                } else {
                    document.getElementById(ruaField).value = "";
                    document.getElementById(bairroField).value = "";
                    document.getElementById(cidadeField).value = "";
                    document.getElementById(estadoField).value = "";
                    popup.showPopup('CEP não encontrado. Verifique e tente novamente.', 'Erro', 'erro');
                }
            })
            .catch(error => {
                popup.hidePopup();
                document.getElementById(ruaField).value = "";
                document.getElementById(bairroField).value = "";
                document.getElementById(cidadeField).value = "";
                document.getElementById(estadoField).value = "";
                popup.showPopup('Erro ao buscar o CEP. Tente novamente mais tarde.', 'Erro', 'erro');
            });
        }, 2000); // Atraso de 5 segundos
    }
}

