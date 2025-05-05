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
        if (!response.ok) {
            throw new Error(`Erro: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro na requisição:', error);
        return null;
    }
}

function buscarEndereco(cepField, ruaField, bairroField, cidadeField, estadoField) {
    let cep = document.getElementById(cepField).value.replace(/\D/g, '');
    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    document.getElementById(ruaField).value = data.logradouro;
                    document.getElementById(bairroField).value = data.bairro;
                    document.getElementById(cidadeField).value = data.localidade;
                    document.getElementById(estadoField).value = data.uf;
                }
            })
            .catch(error => console.error('Erro ao buscar o CEP:', error));
    }
}

