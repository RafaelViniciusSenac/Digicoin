async function apiRequest(url, method = 'GET', body = null, headers = {}) {
    const loadingPopup = new Popup();
    loadingPopup.showLoadingPopup('Carregando dados...');
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
        loadingPopup.hidePopup();
        if (!response.ok) {
            throw new Error(`Erro: ${response.status} - ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        loadingPopup.hidePopup();
        console.error('Erro na requisição:', error);
        return null;
    }
}

function buscarEndereco(cepField, ruaField, bairroField, cidadeField, estadoField) {
    let cep = document.getElementById(cepField).value.replace(/\D/g, '');

    if (cep.length == 8) {
        console.log('Buscando endereço...');
        const popup = new Popup();
        popup.showLoadingPopup('Buscando endereço...');
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
    }
}

