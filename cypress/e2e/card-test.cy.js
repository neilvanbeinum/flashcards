describe('Card Test', () => {
  xit('Cannot start a test if no cards have been made', () => {
    cy.visit('/')

    cy.contains('button', 'Start Test').should('be.disabled')
  })
  
  it('Presents a test with all cards in random order', () => {
    cy.loadCardsIntoStorage([
      {
        frontText: 'front1',
        backText: 'back1'
      },
      {
        frontText: 'front2',
        backText: 'back2'
      }
    ])
    
    cy.visit('/')
    
    cy.contains('button', 'Start Test').click()

    cy.get('div#card-test').contains('')
  })
})
