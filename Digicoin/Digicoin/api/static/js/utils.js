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