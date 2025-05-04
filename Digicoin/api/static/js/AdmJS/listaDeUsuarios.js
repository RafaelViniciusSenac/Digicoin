// Aguardar o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    const popupCadastrarUsuario = document.getElementById('popupCadastrarUsuario');
    const addUsuarios = document.getElementById('addUsuarios');
    const fecharCadastrar = document.getElementById('fecharCadastrar');
    const cadastrarUsuario = document.getElementById('cadastrarUsuario');    

    addUsuarios.addEventListener('click', () => {
        popupCadastrarUsuario.showModal();

    });
   
    fecharCadastrar.addEventListener('click', () => {
        popupCadastrarUsuario.close();
    });

    
  
    
    const popupAdicionarMoedas = document.getElementById('popupAdicionarMoedas');
    const addMoedas = document.getElementById('addMoedas');
    const fecharAdicionarMoedas = document.getElementById('fecharAdicionarMoedas');

   
    

    fecharAdicionarMoedas.addEventListener('click', () => {
        popupAdicionarMoedas.close();
    });

        // Selecionar todos os usuários ativos
    const selecionarTodos = document.getElementById('selecionarTodos');
    selecionarTodos.addEventListener('change', (e) => {
        const checkboxes = document.querySelectorAll('.linhaUsuario:not(.desativado) .checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = e.target.checked;
            checkbox.disabled = false; // Garante que estejam habilitados
        });
    });

    // Atualizar o checkbox "Selecionar todos" quando checkboxes individuais forem alterados
    document.querySelectorAll('.linhaUsuario:not(.desativado) .checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const allChecked = [...document.querySelectorAll('.linhaUsuario:not(.desativado) .checkbox')]
                .every(checkbox => checkbox.checked);
            selecionarTodos.checked = allChecked;
        });
    });
    

    const editar = document.querySelectorAll('[id="editar"]');
    for (let i = 0; i < editar.length; i++) {
        editar[i].addEventListener('click', () => {
            const id = editar[i].getAttribute('data-id');
            const popupEditarUsuario = document.getElementById(`editarUsuario-${id}`);
            popupEditarUsuario.showModal();
            
        });
    }

    document.querySelectorAll('.close-dialog').forEach(botao => {
        botao.addEventListener('click', (e) => {
            const dialog = botao.closest('dialog');
            if (dialog) {
                dialog.close();
            }
        });
    });

    document.querySelectorAll('.saldo-button').forEach(botao => {
        botao.addEventListener('click', (e) => {
            const saldoControl = botao.closest('.saldo-control');
            const inputSaldo = saldoControl.querySelector('.saldo');
            let valorAtual = parseInt(inputSaldo.value) || 0;
    
            if (botao.classList.contains('add')) {
                valorAtual += 1;
            } else if (botao.classList.contains('sub')) {
                valorAtual = Math.max(0, valorAtual - 1); // Não permite valores negativos
            }
    
            inputSaldo.value = valorAtual;
        });
    });

    document.querySelectorAll('.action-button.desativar, .action-button.ativar').forEach(botao => {
        botao.addEventListener('click', (e) => {
            const dialog = botao.closest('dialog');
            const form = dialog.querySelector('.formEditar');
            const statusInput = form.querySelector('input[name="is_active"]');
            
            if (botao.classList.contains('desativar')) {
                statusInput.value = 'false';
                alert('Usuário desativado com sucesso!');
            } else if (botao.classList.contains('ativar')) {
                statusInput.value = 'true';
                alert('Usuário ativado com sucesso!');
            }
            
            // Opcional: feedback visual
            dialog.querySelectorAll('.action-button').forEach(btn => btn.classList.remove('active'));
            botao.classList.add('active');
        });
    });

    document.querySelectorAll('.formEditar').forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Pega o ID do usuário a partir do diálogo pai
            const dialog = this.closest('.editarUsuario');
            const userId = dialog.id.split('-')[1]; // Extrai o ID do usuário do ID do diálogo
            
            // Dados do formulário
            const nome = this.querySelector('.nome').value;
            const email = this.querySelector('.email').value;
            const ra = this.querySelector('.ra').value;
            const saldo = this.querySelector('.saldo').value;
            const status = this.querySelector('input[name="is_active"]').value;
            const csrf = document.querySelector('[name=csrfmiddlewaretoken]').value;
            
            const response = await apiRequest(`/api/user/${userId}`, "PUT", {
                username: email,
                ra: ra,
                first_name: nome,
                saldo: saldo,
                is_active: status
            },
            {
                'X-CSRFToken': csrf
            });
            
            if (response.status == 200) {
                console.log(response);
                // Atualizar a interface, se necessário
                location.reload(); // Recarrega a página (opcional)
            } else {
                console.log("Erro ao editar usuário: " + response);
                alert("Erro ao editar usuário!");
            }
        });
    });

    const concluido = document.querySelectorAll('#concluido');

    concluido.forEach(botao => {
        botao.addEventListener('click', (e) => {
            // Acha o <dialog> mais próximo na hierarquia
            const dialog = botao.closest('dialog');
            if (dialog) {
                dialog.close();
            }
            window.location.reload();
        });
    });

    // Modifique o evento de clique do botão addMoedas
addMoedas.addEventListener('click', () => {
    popupAdicionarMoedas.showModal();
    const usuariosSelecionados = getUsuariosSelecionados(); // Alteramos para pegar mais dados
    
    // Novo código para manipular o popup
    const formAdicionarMoedas = document.getElementById('formAdicionarMoedas');
    const inputQuantidade = document.getElementById('saldo');
    
    // Função para enviar as moedas
    const enviarMoedas = async (operacao) => {
        const valor = parseInt(inputQuantidade.value);
        const csrf = document.querySelector('[name=csrfmiddlewaretoken]').value;
        if (isNaN(valor)) {
            alert('Digite um valor válido!');
            return;
        }

        try {
            for (const usuario of usuariosSelecionados) {
                const novoSaldo = operacao === 'adicionar' 
                    ? usuario.saldo + valor 
                    : Math.max(0, usuario.saldo - valor);
                
                const response = await apiRequest(`/api/user/${usuario.id}`, "PUT", {
                    saldo: novoSaldo
                }
                ,{
                    'X-CSRFToken': csrf
                });
                
                if (response.status !== 200) {
                    throw new Error(`Falha ao atualizar usuário ${usuario.id}`);
                }
            }
            
            alert('Operação realizada com sucesso!');
            popupAdicionarMoedas.close();
            location.reload();
            
        } catch (error) {
            console.error('Erro:', error);
            alert(`Erro na operação: ${error.message}`);
        }
    };

    // Adiciona eventos aos botões
    document.getElementById('adicionar').addEventListener('click', (e) => {
        e.preventDefault();
        enviarMoedas('adicionar');
    });

    document.getElementById('remover').addEventListener('click', (e) => {
        e.preventDefault();
        enviarMoedas('remover');
    });
});

// Atualize a função para obter dados completos
function getUsuariosSelecionados() {
    const linhas = document.querySelectorAll('.linhaUsuario');
    const usuarios = [];

    linhas.forEach(linha => {
        const checkbox = linha.querySelector('.checkbox');
        const inputId = linha.querySelector('.idUser');
        const saldoElement = linha.querySelector('span:not(.nome):not(.status)');

        if (checkbox && checkbox.checked && inputId && saldoElement) {
            const saldo = parseInt(saldoElement.textContent.replace('D$ ', '')) || 0;
            usuarios.push({
                id: inputId.value,
                saldo: saldo
            });
        }
    });

    return usuarios;
}
    
   

});
