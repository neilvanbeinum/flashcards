import { STORAGE_KEY } from "../../app/constants"

it("Displays cards from localstorage on loading", () => {
  const cards = [
    {
      frontText: "frontText1",
      backText: "backText1",
    },
    {
      frontText: "frontText2",
      backText: "backText2",
    },
  ]

  cy.window().then((window) => {
    window.localStorage[STORAGE_KEY] = JSON.stringify(cards)
  })

  cy.visit("/")

  cy.get("#cards li").should(
    "have.arrayElements",
    2,
    "frontText1 - backText1",
    "frontText2 - backText2"
  )
})

it("Saves cards to localstorage when added", () => {
  const now = Date.now()

  cy.clock(now)

  cy.visit("/")

  cy.contains("Add New Card").click()

  cy.getTextAreaForLabel("Front Text").type("What is a cloud?")

  cy.get("form").submit()

  cy.getTextAreaForLabel("Back Text").type("Water vapour in the sky")

  cy.get("form").submit()

  cy.window().should((window) => {
    expect(window.localStorage[STORAGE_KEY]).to.be.a("string").that.is.not.empty

    expect(JSON.parse(window.localStorage[STORAGE_KEY])).to.eql([
      {
        frontText: "What is a cloud?",
        backText: "Water vapour in the sky",
        createdAt: now,
      },
    ])
  })
})

it("Saves cards to localstorage when deleted", () => {
  const cards = [
    {
      frontText: "frontText1",
      backText: "backText1",
    },
  ]

  cy.window().then((window) => {
    window.localStorage[STORAGE_KEY] = JSON.stringify(cards)
  })

  cy.visit("/")

  cy.get("#cards li").eq(0).contains("Delete").click()

  cy.window().then((window) => {
    expect(JSON.parse(window.localStorage[STORAGE_KEY])).to.be.empty
  })
})
