import { STORAGE_KEY } from "../../app/constants"

Cypress.Commands.add("loadCardsIntoStorage", (cards) => {
  cy.window().then((window) => {
    window.localStorage[STORAGE_KEY] = JSON.stringify(cards)
  })
})

Cypress.Commands.add("getTextAreaForLabel", (label) => {
  return cy.contains("label", label).next().shadow().find("textarea")
})
