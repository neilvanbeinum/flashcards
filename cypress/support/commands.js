Cypress.Commands.add("getTextAreaForLabel", (label) => {
  cy.contains("label", label).then(($label) => {
    const labelFor = $label.attr("for")

    return cy.get(`#${labelFor}`)
  })
})

Cypress.Commands.add("login", (email, password) => {
  cy.visit("/")

  cy.get('input[name="login"]').type(email)
  cy.get('input[name="password"]').type(password)

  cy.contains('input[type="submit"]', "Login").click()
})
