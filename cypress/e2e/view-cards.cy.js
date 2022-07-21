describe('Viewing cards', () => {
  it('Allows card creation and deletion', () => {
    cy.visit('/')

    cy.get('input#front-text').type('What is a cloud?')
    cy.get('input#back-text').type('Water vapour in the sky')

    cy.get('button').contains('Save Card').click()
    
    cy.get('#cards li').should(
      'have.arrayElements',
      1,
      'What is a cloud? - Water vapour in the sky'
    )
    
    cy.get('input#front-text').type('What is a hedgehog?')
    cy.get('input#back-text').type('Spiky rodent that lives in hedges')
    
    cy.get('button').contains('Save Card').click()

    cy.get('#cards li').should(
      'have.arrayElements',
      2,
      'What is a cloud? - Water vapour in the sky',
      'What is a hedgehog? - Spiky rodent that lives in hedges'
    )

    cy.get('#cards li').eq(0).contains('button', 'Delete').click()

    cy.get('#cards li').should(
      'have.arrayElements',
      1,
      'What is a hedgehog? - Spiky rodent that lives in hedges'
    )

    cy.get('input#front-text').type('What is a bee?')
    cy.get('input#back-text').type('Striped insect that loves nectar')

    cy.get('button').contains('Save Card').click()

    cy.get('#cards li').should(
      'have.arrayElements',
      2,
      'What is a hedgehog? - Spiky rodent that lives in hedges',
      'What is a bee? - Striped insect that loves nectar'
    )

    cy.get('#cards li').eq(0).contains('button', 'Delete').click()
    cy.get('#cards li').eq(0).contains('button', 'Delete').click()

    cy.get('#cards li').should('have.arrayElements', 0)
  })
})
