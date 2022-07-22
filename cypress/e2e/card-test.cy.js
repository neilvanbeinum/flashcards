describe('Card Test', () => {
  it('Cannot start a test if no cards have been made', () => {
    cy.visit('/')

    cy.contains('Start Test').shadow().find('button').should('be.disabled')
  })
  
  it('Presents a test with all cards', () => {
    const cards = [
      {
        frontText: 'front1',
        backText: 'back1'
      },
      {
        frontText: 'front2',
        backText: 'back2'
      }
    ]

    cy.loadCardsIntoStorage(cards)
    
    cy.visit('/')

    cy.contains('Start Test').click()

    cy.get('#cards li').each((item) => {
      cy.wrap(item).find('.delete-card').shadow().find('button').should('be.disabled')
    })

    cy.get('fieldset#create-card-fieldset').should('be.disabled')
    
    cy.get('div#test-container').contains('front1')
    
    cy.contains('Flip Card').click()

    cy.get('div#test-container').contains('back1')
    
    cy.contains('Flip Card').click()

    cy.get('div#test-container').contains('front1')
    
    cy.contains('Next Card').click()
    
    cy.get('div#test-container').contains('front2')
    
    cy.contains('Flip Card').click()

    cy.get('div#test-container').contains('back2')
    
    cy.contains('Next Card').shadow().find('button').should('be.disabled')

    cy.contains('End Test').click()
    
    cy.get('fieldset#create-card-fieldset').should('not.be.disabled')

    cy.get('div#test-container').should('be.empty')
  })
})
