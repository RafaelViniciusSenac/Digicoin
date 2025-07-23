describe('Teste Digicoin', () => {
    it('login primeiro acesso', () => {
      cy.visit('/')
      cy.get('#email').type('teste@teste.com')
      cy.get('#senha').type('123')
      cy.get('.botaoTelaBranca').click()
      
      cy.get('#popUpPrimeiroAcesso', { timeout: 10000 }) 
        .should('be.visible')
  
      cy.get('#popUpPrimeiroAcesso #senha').type('123')
      cy.get('#popUpPrimeiroAcesso #confirmarSenha').type('123')
      cy.get('#popUpPrimeiroAcesso #concluirPrimeiroAcesso').click()
  
      cy.get('#email').type('teste@teste.com')
      cy.get('#senha').type('123')
      cy.get('.botaoTelaBranca').click()
    })
    
  })