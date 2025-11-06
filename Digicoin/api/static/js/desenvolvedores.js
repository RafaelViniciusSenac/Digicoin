// Gera sombras aleatórias
function multipleBoxShadow(n) {
  let value = '';
  for (let i = 0; i < n; i++) {
    const x = Math.floor(Math.random() * 2000);
    const y = Math.floor(Math.random() * 2000);
    value += `${x}px ${y}px #FFF`;
    if (i < n - 1) value += ', ';
  }
  return value;
}

// Gerar sombras
const shadowsSmall = multipleBoxShadow(700);
const shadowsMedium = multipleBoxShadow(200);
const shadowsBig = multipleBoxShadow(100);

// Aplicar às camadas
const stars = document.getElementById('stars');
const stars2 = document.getElementById('stars2');
const stars3 = document.getElementById('stars3');

if (stars && stars2 && stars3) {
  stars.style.boxShadow = shadowsSmall;
  stars2.style.boxShadow = shadowsMedium;
  stars3.style.boxShadow = shadowsBig;

  // Clonar para loop infinito
  function cloneForLoop(element, shadow) {
    const clone = element.cloneNode(true);
    clone.style.top = '2000px';
    clone.style.boxShadow = shadow;
    element.parentNode.appendChild(clone);
  }

  cloneForLoop(stars, shadowsSmall);
  cloneForLoop(stars2, shadowsMedium);
  cloneForLoop(stars3, shadowsBig);
}