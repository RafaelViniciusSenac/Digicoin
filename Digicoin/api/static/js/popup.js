
if (window.Popup === undefined) {
    class Popup {
        constructor() {
            this.injectCSS();
            this.overlay = null;
            this.popup = null;
            this.popupHeader = null;
            this.popupTitulo = null;
            this.imgClosed = null;
            this.popupBody = null;
            this.popupFooter = null;
            this.dialog = null;
            this.tipo = '';
            this.loadingTimeoutId = null;
        }

        injectCSS() {
            const style = document.createElement('style');
            style.innerHTML = `
                :root {
                    --erro: #e74c3c;
                    --sucesso: #2ecc71;
                    --confirmacao: #f1c40f;
                    --base: #2c006a;
                    --branco: #fff;
                    --sombra-base: rgba(44, 0, 106, 0.4);
                }

                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                body.no-scroll-popup-alerta {
                    overflow: hidden;
                }

                .popup-alerta-dialog {
                    position: fixed;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                    overflow: auto;
                    border: none !important;
                    outline: none !important;
                    box-shadow: none !important;
                    padding: 0 !important;
                }
                
                .popup-alerta-dialog:focus {
                    outline: none !important;
                    box-shadow: none !important;
                }


                .popup-alerta-container {
                    background-color: var(--branco);
                    max-width: 600px;
                    min-width: 300px;
                    margin: 10px;
                    border-radius: 10px;
                    padding: 10px;
                    position: relative;
                    animation: fadeInUp 0.3s ease-out;
                    box-shadow: 0 10px 20px var(--sombra-base);
                }

                .popup-alerta-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                    gap: 10px;
                }

                .popup-alerta-titulo {
                    flex-grow: 1;
                    font-weight: bold;
                    font-size: 22px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .popup-alerta-titulo-texto {
                    font-style: bold;
                }

                .popup-alerta-fechar {
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                    margin-left: auto;
                }

                .popup-alerta-fechar:hover {
                    transform: scale(1.5);
                }

                .popup-alerta-body {
                    text-align: center;
                    margin: 20px 0;
                    font-size: 18px;
                    color: var(--base);
                }

                .popup-alerta-footer {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                }

                .popup-alerta-btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                }

                .popup-alerta-btn-confirmar {
                    background-color: var(--sucesso);
                    color: var(--branco);
                }

                .popup-alerta-btn-confirmar:hover {
                    opacity: 0.8;
                }

                .popup-alerta-btn-cancelar {
                    background-color: var(--erro);
                    color: var(--branco);
                }

                .popup-alerta-btn-cancelar:hover {
                    opacity: 0.8;
                }   
                    
                .popup-erro { color: var(--erro); }
                .popup-sucesso { color: var(--sucesso); }
                .popup-confirmacao { color: var(--confirmacao); }
                .popup-padrao {
                    color: var(--base);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-left: auto;
                }

                .popup-alerta-icon {
                    width: 24px;
                    height: 24px;
                }

                .popup-loading {
                    color: var(--base);
                    font-size: 18px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }

                .popup-loading img {
                    width: 40px;
                    height: 40px;
                    margin-bottom: 10px;
                }
            `;
            document.head.appendChild(style);
        }

        showPopup(conteudo, titulo = ' ', tipo = 'padrao', onConfirm = null, onCancel = null) {
            this.tipo = tipo;
            this.removeOldPopup();
            this.createElements();
            this.setAttributes(tipo);
            this.appendElements();

            this.popupTitulo.innerHTML = '';
            if (tipo !== 'padrao') {
                const icon = document.createElement('img');
                icon.className = 'popup-alerta-icon';
                icon.src = this.getIconSrc(tipo);
                icon.alt = tipo;
                this.popupTitulo.appendChild(icon);
            }

            const tituloSpan = document.createElement('span');
            tituloSpan.className = 'popup-alerta-titulo-texto';
            tituloSpan.textContent = ' ' + titulo;
            this.popupTitulo.appendChild(tituloSpan);

            this.popupBody.innerHTML = '';
            const texto = document.createElement('div');
            texto.innerHTML = conteudo;
            this.popupBody.appendChild(texto);

            if (tipo === 'confirmacao') {
                const btnConfirmar = document.createElement('button');
                btnConfirmar.className = 'popup-alerta-btn popup-alerta-btn-confirmar';
                btnConfirmar.innerText = 'Confirmar';
                btnConfirmar.onclick = () => {
                    if (onConfirm) onConfirm();
                    this.hidePopup();
                };

                const btnCancelar = document.createElement('button');
                btnCancelar.className = 'popup-alerta-btn popup-alerta-btn-cancelar';
                btnCancelar.innerText = 'Cancelar';
                btnCancelar.onclick = () => {
                    if (onCancel) onCancel();
                    this.hidePopup();
                };

                this.popupFooter.appendChild(btnConfirmar);
                this.popupFooter.appendChild(btnCancelar);
            }

            this.dialog.style.display = "flex";
            document.body.classList.add('no-scroll-popup-alerta');
        }

        showLoadingPopup(mensagem = 'Carregando...') {
            this.tipo = 'loading';
            this.removeOldPopup();
            this.createElements();
            this.setAttributes('loading');

            const loadingIcon = document.createElement('img');
            loadingIcon.src = staticUrlImgs + 'popup-carregando.gif';
            loadingIcon.alt = 'Carregando';

            const loadingText = document.createElement('div');
            loadingText.textContent = mensagem;

            this.popupBody.innerHTML = '';
            this.popupBody.appendChild(loadingIcon);
            this.popupBody.appendChild(loadingText);

            this.popupHeader.style.display = 'none';
            this.popupFooter.style.display = 'none';

            this.popup.appendChild(this.popupBody);
            this.popup.appendChild(this.popupFooter);
            this.dialog.appendChild(this.popup);
            document.body.appendChild(this.dialog);
            this.dialog.showModal();

            // Salva o timeoutId para poder cancelar depois
            this.loadingTimeoutId = setTimeout(() => {
                if (this.tipo === 'loading') {
                    this.hidePopup();
                    this.showPopup(
                        'Não foi possível carregar os dados. Tente novamente mais tarde.',
                        'Erro',
                        'erro'
                    );
                }
            }, 10000);
        }
        
        hidePopup() {
            if (this.loadingTimeoutId) {
                clearTimeout(this.loadingTimeoutId);
                this.loadingTimeoutId = null;
            }
            this.dialog.remove();
            document.body.classList.remove('no-scroll-popup-alerta');
        }

        removeOldPopup() {
            const oldPopup = document.querySelector(".popup-alerta-dialog");
            if (oldPopup) {
                if (this.tipo !== 'padrao' && oldPopup.querySelector(".popup-padrao")) {
                    return;
                }
                oldPopup.remove();
            }
        }

    createElements() {
        if (this.tipo !== 'padrao'){
            this.dialog = document.createElement("dialog");
        } else {
            this.dialog = document.createElement("div");
        }
        this.dialog.style.padding = "0";
        this.dialog.style.border = "none";
        this.dialog.style.background = "transparent";
        this.popup = document.createElement("div");
        this.popupHeader = document.createElement("div");
        this.popupTitulo = document.createElement("div");
        this.imgClosed = document.createElement("img");
        this.popupBody = document.createElement("div");
        this.popupFooter = document.createElement("div");
    }

    setAttributes(tipo) {
        this.dialog.className = tipo === 'loading' ? 'popup-alerta-dialog popup-loading' : 'popup-alerta-dialog';
        this.popup.className = "popup-alerta-container";
        this.popupHeader.className = "popup-alerta-header";
        this.popupTitulo.className = `popup-alerta-titulo popup-${tipo}`;
        this.imgClosed.className = "popup-alerta-fechar";
        this.imgClosed.src = staticUrlImgs + "popup-x.png";
        this.imgClosed.alt = "Fechar";
        this.imgClosed.addEventListener("click", () => this.hidePopup());
        this.popupBody.className = "popup-alerta-body";
        this.popupFooter.className = "popup-alerta-footer";
    }

    appendElements() {
        this.popupHeader.appendChild(this.popupTitulo);
        this.popupHeader.appendChild(this.imgClosed);
        this.popup.appendChild(this.popupHeader);
        this.popup.appendChild(this.popupBody);
        this.popup.appendChild(this.popupFooter);
        this.dialog.appendChild(this.popup);
        document.body.appendChild(this.dialog);
        if (this.tipo !== 'padrao'){
            this.dialog.showModal();
        }
    }

    getIconSrc(tipo) {
        switch (tipo) {
        case 'erro': return staticUrlImgs + 'popup-erro.png';
        case 'sucesso': return staticUrlImgs + 'popup-sucesso.png';
        case 'confirmacao': return staticUrlImgs + 'popup-confirmacao.png';
        default: return '';
        }
    }
    }

    window.confirmarAcao = function(mensagem, titulo = 'Confirmação') {
        return new Promise((resolve, reject) => {
            const popup = new Popup();
            popup.showPopup(
                mensagem,
                titulo,
                'confirmacao',
                () => resolve(true),   // Confirmar
                () => resolve(false)   // Cancelar
            );
        });
    };

    window.showPopup = function(mensagem, titulo = ' ', tipo = 'padrao', onConfirm = null, onCancel = null) {
        const popup = new Popup();
        popup.showPopup(mensagem, titulo, tipo, onConfirm, onCancel);
    };

    window.showLoadingPopup = function(mensagem = 'Carregando...') {
        const popup = new Popup();
        popup.showLoadingPopup(mensagem);
    };

    window.Popup = Popup;
}
