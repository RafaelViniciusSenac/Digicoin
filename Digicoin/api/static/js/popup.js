
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

            .overlay-popup-alerta {
                position: fixed;
                top: 0; left: 0;
                width: 100%; height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: flex-start;
                overflow-y: auto;
                z-index: 9999;
            }

            .popup-alerta-container {
                background-color: var(--branco);
                max-width: 600px;
                margin: 20px;
                border-radius: 20px;
                padding: 20px;
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
            }

            .popup-alerta-fechar {
                width: 20px;
                height: 20px;
                cursor: pointer;
                margin-left: auto;
            }

            .popup-alerta-body {
                text-align: center;
                margin: 20px 0;
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

            .popup-alerta-btn-cancelar {
                background-color: var(--erro);
                color: var(--branco);
            }

            .popup-erro { color: var(--erro); }
            .popup-sucesso { color: var(--sucesso); }
            .popup-confirmacao { color: var(--confirmacao); }

            .popup-alerta-icon {
                width: 24px;
                height: 24px;
            }
        `;
        document.head.appendChild(style);
    }

    showPopup(conteudo, titulo = ' ', tipo = 'confirmacao', onConfirm = null, onCancel = null) {
        this.removeOldPopup();
        this.createElements();
        this.setAttributes(tipo);
        this.appendElements();

        this.popupTitulo.innerHTML = '';
        const icon = document.createElement('img');
        icon.className = 'popup-alerta-icon';
        icon.src = this.getIconSrc(tipo);
        icon.alt = tipo;
        this.popupTitulo.appendChild(icon);
        this.popupTitulo.appendChild(document.createTextNode(' ' + titulo));

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

        this.overlay.style.display = "flex";
        document.body.classList.add('no-scroll-popup-alerta');
    }

    hidePopup() {
        this.removeOldPopup();
        document.body.classList.remove('no-scroll-popup-alerta');
    }

    removeOldPopup() {
        const oldPopup = document.querySelector(".overlay-popup-alerta");
        if (oldPopup) oldPopup.remove();
    }

    createElements() {
        this.overlay = document.createElement("div");
        this.popup = document.createElement("div");
        this.popupHeader = document.createElement("div");
        this.popupTitulo = document.createElement("div");
        this.imgClosed = document.createElement("img");
        this.popupBody = document.createElement("div");
        this.popupFooter = document.createElement("div");
    }

    setAttributes(tipo) {
        this.overlay.className = "overlay-popup-alerta";
        this.popup.className = "popup-alerta-container";
        this.popupHeader.className = "popup-alerta-header";
        this.popupTitulo.className = `popup-alerta-titulo popup-${tipo}`;
        this.imgClosed.className = "popup-alerta-fechar";
        this.imgClosed.src = "../../static/img/popup-x.png";
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
        this.overlay.appendChild(this.popup);
        document.body.appendChild(this.overlay);
    }

    getIconSrc(tipo) {
        switch (tipo) {
            case 'erro': return '../../static/img/popup-erro.png';
            case 'sucesso': return '../../static/img/popup-sucesso.png';
            case 'confirmacao': return '../../static/img/popup-confirmacao.png';
            default: return '';
        }
    }
}

window.Popup = Popup;
