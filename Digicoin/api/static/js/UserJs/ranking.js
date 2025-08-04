// var ran = [ // Simula o ranking
//   {
//       id: 1,
//       posicao: 1,
//       nome: "Fulano Brasil",
//       valor: 2000,
//   },
//   {
//     id: 1,
//     posicao: 2,
//     nome: "Fulano Silva",
//     valor: 1500,
// },
// {
//     id: 1,
//     posicao: 3,
//     nome: "Fulano Pereira",
//     valor: 1000,
// },
// {
//     id: 1,
//     posicao: 4,
//     nome: "Fulano Campos",
//     valor: 800,
// },
// {
//     id: 1,
//     posicao: 5,
//     nome: "Fulano Souza",
//     valor: 500,
// },
// ];
// let ascending = true;
// const qtdDigicoins = 10000;//Simula quantidade de digicoins

// function preencherRanking(ranking) {
//   ran = ranking;
//   const cartItemsContainer = document.getElementById("cart-items");

//   cartItemsContainer.innerHTML = ""; // Limpa os itens existentes

//   ran.forEach((item) => { // Para cada item do ranking
//     let valor = '<span class="cor-moeda">D$</span> <span class="cor-valor">' + parseFloat(item.valor) + '</span>'; // passa o valor para float
//     let posicao = parseInt(item.posicao); // passa a quantidade para int
//     let nome = item.nome;
//     const itemRow = document.createElement("tr");
//     if (posicao===1){
//       itemRow.className = "posicao1"
//       posicao = `<span class="posicao1-tamanho-fonte">${posicao}</span>`;
//       nome = `<span class="posicao1-tamanho-fonte">${nome}</span>`;
//       valor = `<span class="posicao1-tamanho-fonte">${valor}</span>`;
//     }
//     itemRow.innerHTML = `
//         <td data-label="Posicao" class="posicaocor"><span class="span_posicao"></span>${posicao}</td>
//         <td data-label="Nomes">${nome}</td>
//         <td data-label="Valor" class="valor_tag">${valor}</td >
//       `;
//     cartItemsContainer.appendChild(itemRow);
//   });
// }

// function removerItem(id) {
//     // Encontra o índice do item com o id fornecido
//     const index = ran.findIndex(item => item.id === parseInt(id));
    
//     // Verifica se o item foi encontrado
//     if (index !== -1) {
//       // Remove o item do array
//       ran.splice(index, 1);
      
//       // Atualiza o localStorage
//       localStorage.setItem("cart", JSON.stringify(ran));
      
//       // Recalcula e atualiza o ranking
//       preencherCarrinho(ran);
      
//       //syncLocalCartToServer(ran); // Se necessário
//     }
//   }

// function ordenarItens(element, propriedade) {
//   if (element.className==='sort-desc') {
//     element.className = 'sort-asc';
//     ran.sort((a, b) => {
//         return a[propriedade].localeCompare(b[propriedade])
//     });
//   } else {
//     element.className = 'sort-desc';
//     ran.sort((a, b) => {
//       return b[propriedade].localeCompare(a[propriedade]);
//     });
//   }
//   console.log(ran);
//   preencherRanking(ran);
// }

// document.addEventListener("DOMContentLoaded", () => {
//     preencherRanking(ran);
// });
