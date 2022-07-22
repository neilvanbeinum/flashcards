describe('Viewing cards', () => {
  it('Allows card creation and deletion', () => {
    cy.visit('/')

    cy.getInputForLabel('Front Text').type('What is a cloud?')
    cy.getInputForLabel('Back Text').type('Water vapour in the sky')

    cy.contains('Save Card').click()

    cy.get('#cards li').should(
      'have.arrayElements',
      1,
      'What is a cloud? - Water vapour in the sky'
  )

    cy.getInputForLabel('Front Text').type('What is a hedgehog?')
    cy.getInputForLabel('Back Text').type('Spiky rodent that lives in hedges')

    cy.contains('Save Card').click()

    cy.get('#cards li').should(
      'have.arrayElements',
      2,
      'What is a cloud? - Water vapour in the sky',
      'What is a hedgehog? - Spiky rodent that lives in hedges'
    )

    cy.get('#cards li').eq(0).contains('Delete').click()

    cy.get('#cards li').should(
      'have.arrayElements',
      1,
      'What is a hedgehog? - Spiky rodent that lives in hedges'
    )

    cy.getInputForLabel('Front Text').type('What is a bee?')
    cy.getInputForLabel('Back Text').type('Striped insect that loves nectar')

    cy.contains('Save Card').click()

    cy.get('#cards li').should(
      'have.arrayElements',
      2,
      'What is a hedgehog? - Spiky rodent that lives in hedges',
      'What is a bee? - Striped insect that loves nectar'
    )

    cy.get('#cards li').eq(0).contains('Delete').click()
    cy.get('#cards li').eq(0).contains('Delete').click()

    cy.get('#cards li').should('have.arrayElements', 0)
  })
})
