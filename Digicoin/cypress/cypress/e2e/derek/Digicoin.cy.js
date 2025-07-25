describe('Página de Campanhas Criadas', () => {
  beforeEach(() => {
    cy.visit('/campanhas');
  });

  it('deve carregar a página com título correto', () => {
    cy.get('#titulo-campanhas').should('contain.text', 'Campanhas Criadas');
  });

  it('deve exibir o campo de busca', () => {
    cy.get('#barraBusca').should('be.visible');
  });

  it('deve exibir o botão "Criar Campanha"', () => {
    cy.get('#botao-criar-campanha').should('be.visible').and('contain.text', 'Criar Campanha');
  });

  it('deve listar pelo menos uma campanha', () => {
    cy.get('tr[id^="linha-campanha-"]').should('have.length.greaterThan', 0);
  });

  it('cada campanha deve ter nome, data de término, botão editar e excluir', () => {
    cy.get('tr[id^="linha-campanha-"]').first().within(() => {
      cy.get('h2[id^="nome-campanha-"]').should('exist');
      cy.get('h2[id^="data-fim-campanha-"]').should('exist');
      cy.get('button[id^="editar-campanha-"]').should('exist');
      cy.get('button[id^="excluir-campanha-"]').should('exist');
    });
  });

  it('deve permitir filtrar campanhas pelo campo de busca', () => {
    cy.get('#barraBusca').type('dsadsa');
    cy.wait(500);
    cy.get('tr[id^="linha-campanha-"]').each($tr => {
      cy.wrap($tr).should('contain.text', 'dsadsa');
    });
  });

  it('deve avançar e voltar na paginação', () => {
    cy.get('#botao-proxima').click();
    cy.get('#pagina-atual-predefinida').should('contain.text', '2');

    cy.get('#botao-anterior').click();
    cy.get('#pagina-atual-predefinida').should('contain.text', '1');
  });

  it('deve acionar o botão de editar campanha', () => {
    cy.get('button[id^="editar-campanha-"]').first().click();
    // Aqui você pode verificar se um modal abriu ou se mudou de rota, conforme sua lógica
    // Exemplo: cy.url().should('include', '/campanhas/editar');
  });

  it('deve acionar o botão de excluir campanha', () => {
    cy.get('button[id^="excluir-campanha-"]').first().click();
    // Esperado: um modal de confirmação, ou remoção da linha — depende da lógica implementada
    // cy.contains('Deseja realmente excluir').should('be.visible');
  });
});
