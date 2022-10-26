describe("Card Test", () => {
  it("Cannot start a test if no cards have been made", () => {
    cy.visit("/")

    cy.contains("a", "Start Test").should("not.exist")
  })

  it("Presents a test with all cards", () => {
    const cards = [
      {
        frontText: "front1",
        backText: "back1",
      },
      {
        frontText: "front2",
        backText: "back2",
      },
    ]

    cy.loadCardsIntoStorage(cards)

    cy.visit("/")

    cy.contains("button", "Start Test").click()

    cy.get("div#test-container").contains("front1")

    cy.contains("button", "Flip Card").click()

    cy.get("div#test-container").contains("back1")

    cy.contains("button", "Flip Card").click()

    cy.get("div#test-container").contains("front1")

    cy.contains("button", "Next Card").click()

    cy.get("div#test-container").contains("front2")

    cy.contains("button", "Flip Card").click()

    cy.get("div#test-container").contains("back2")

    cy.contains("button", "End Test").click()
  })
})
