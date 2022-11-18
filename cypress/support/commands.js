import { STORAGE_KEY } from "../../app/javascript/constants"

Cypress.Commands.add("loadCardsIntoStorage", (cards) => {
  cy.window().then((window) => {
    window.localStorage[STORAGE_KEY] = JSON.stringify(cards)
  })
})

Cypress.Commands.add("getTextAreaForLabel", (label) => {
  cy.contains("label", label).then(($label) => {
    const labelFor = $label.attr("for")

    return cy.get(`#${labelFor}`)
  })
})

Cypress.Commands.add("login", () => {
  cy.visit("/")

  cy.get('input[name="login"]').type("freddie@queen.com")
  cy.get('input[name="password"]').type("password")

  cy.contains('input[type="submit"]', "Login").click()
})
