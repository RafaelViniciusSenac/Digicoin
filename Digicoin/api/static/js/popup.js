class Popup {
    constructor() {
      this.overlay = null;
      this.popup = null;
      this.popupHeader = null;
      this.popupTitulo = null;
      this.imgClosed = null;
      this.popupBody = null;
    }
  
    async showPopup(conteudo, titulo = ' ') {
      console.log('teste')
      await this.loadCSS(cssPopup);
  
      // Remove o elemento anterior, se existir
      this.removeOldPopup();
  
      // Cria os elementos
      this.createElements();
  
      // Define as classes e atributos
      this.setAttributes();
  
      // Adiciona os elementos ao DOM
      this.appendElements();
  
      // Adiciona o conteúdo
      this.popupTitulo.innerHTML = titulo;
      this.popupBody.innerHTML = conteudo;
  
      // Mostra o popup
      this.overlay.style.display = "flex";
      document.body.classList.add('no-scroll');
    }
  
    async loadCSS(cssUrl) {
      // Verifica se o CSS já está carregado
      if (!document.querySelector(`link[href="${cssUrl}"]`)) {
        // Cria um novo elemento link
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssUrl;
  
        // Adiciona o link ao head do documento
        document.head.appendChild(link);
  
        // Espera o CSS ser carregado
        await new Promise((resolve) => {
          link.onload = resolve;
        });
      }
    }
  
    hidePopup() {
      if (this.overlay) this.overlay.style.display = "none";
      document.body.classList.remove('no-scroll');
    }
  
    removeOldPopup() {
      const oldPopup = document.querySelector(".overlay");
      if (oldPopup) oldPopup.remove();
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
      this.overlay.className = "overlay";
      this.popup.className = "popup";
      this.popupHeader.className = "popup-header";
      this.popupTitulo.className = "popup-titulo";
      this.imgClosed.className = "popup-closed";
      this.imgClosed.src = imgFecharPopupSrc;
      this.imgClosed.alt = "Fechar";
      this.imgClosed.addEventListener("click", () => this.hidePopup());
      this.popupBody.className = "popup-body";
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
  
  export default Popup;