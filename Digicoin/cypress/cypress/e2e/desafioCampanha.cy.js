describe('Teste Desafio Campanha', () => {
  it('passes', () => {
    cy.visit('/')
    cy.get('#email').type('teste@gmail.com')
    cy.get('#senha').type('123')
    cy.get('button[type="submit"]').click()
    cy.get('#desafiosCampanha').click()
    cy.get('#botaoVoltar').click()

  })
})