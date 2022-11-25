describe("Card Test", () => {
  it("Cannot start a test if no cards have been made", () => {
    cy.login("freddie@queen.com", "password")

    cy.contains("a", "Start Test").should("not.exist")
  })

  it("Presents a test with all cards", () => {
    cy.login("brian@queen.com", "password")

    cy.contains("button", "Start Test").click()

    cy.get("div#test-container").contains("front_text_one")
    cy.contains("button", "Flip Card").click()

    cy.get("div#test-container").contains("back_text_one")
    cy.contains("button", "Flip Card").click()

    cy.get("div#test-container").contains("front_text_one")
    cy.contains("button", "Next Card").click()

    cy.get("div#test-container").contains("front_text_two")
    cy.contains("button", "Flip Card").click()

    cy.get("div#test-container").contains("back_text_two")
    cy.contains("button", "End Test").click()
  })
})
