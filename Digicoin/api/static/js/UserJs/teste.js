class Popup {
    constructor() {
        this.overlay = null;
        this.popup = null;
        this.popupHeader = null;
        this.popupTitulo = null;
        this.imgClosed = null;
        this.popupBody = null;
    }

    showPopup(conteudo, titulo = ' ') {
        this.removeOldPopup();
        this.createElements();
        this.setAttributes();
        this.appendElements();
        this.popupTitulo.innerHTML = titulo;
        this.popupBody.innerHTML = conteudo;
        this.overlay.style.display = "flex";
        document.body.classList.add('no-scroll-carrinhoCompras');
    }

    hidePopup() {
        this.removeOldPopup();
        document.body.classList.remove('no-scroll-carrinhoCompras');
    }

    removeOldPopup() {
        const oldPopup = document.querySelector(".overlay-carrinhoCompras");
        if (oldPopup) {
            oldPopup.remove();
        }
    }

    createElements() {
        this.overlay = document.createElement("div");
        this.popup = document.createElement("div");
        this.popupHeader = document.createElement("div");
        this.popupTitulo = document.createElement("div");
        this.imgClosed = document.createElement("img");
        this.popupBody = document.createElement("div");
    }

    setAttributes() {
        this.overlay.className = "overlay-carrinhoCompras";
        this.popup.className = "popup-carrinhoCompras";
        this.popupHeader.className = "popup-header-carrinhoCompras";
        this.popupTitulo.className = "popup-titulo-carrinhoCompras";
        this.imgClosed.className = "popup-closed-carrinhoCompras";
        this.imgClosed.src = imgFecharPopupSrc;
        this.imgClosed.alt = "Fechar";
        this.imgClosed.addEventListener("click", () => this.hidePopup());
        this.popupBody.className = "popup-body-carrinhoCompras";
    }

    appendElements() {
        this.popupHeader.appendChild(this.popupTitulo);
        this.popupHeader.appendChild(this.imgClosed);
        this.popup.appendChild(this.popupHeader);
        this.popup.appendChild(this.popupBody);
        this.overlay.appendChild(this.popup);
        document.body.appendChild(this.overlay);
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const popupInstance = new Popup();
        popupInstance.hidePopup();
    }
});

const popup = new Popup();
popup.showPopup('testando popup', 'teste');