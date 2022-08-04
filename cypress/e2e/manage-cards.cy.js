describe("Managing a card deck", () => {
  it("Allows card creation and deletion", () => {
    cy.visit("/")

    cy.contains("Add New Card").click()

    cy.getTextAreaForLabel("Front Text").type("What is a cloud? TYPO")

    cy.get("form").submit()

    cy.getTextAreaForLabel("Back Text").type("Water vapour in the sky")

    cy.contains("a", "Back").click()

    cy.getTextAreaForLabel("Front Text")
      .clear()
      .type("What is a cloud?", { force: true })

    cy.get("form").submit()

    cy.getTextAreaForLabel("Back Text").should(
      "have.value",
      "Water vapour in the sky"
    )

    cy.get("form").submit()

    cy.contains("#cards li", "What is a cloud?")

    cy.contains("Add New Card").click()

    cy.getTextAreaForLabel("Front Text").type("What is a hedgehog?")

    cy.get("form").submit()

    cy.getTextAreaForLabel("Back Text").type(
      "Spiky rodent that lives in hedges"
    )

    cy.get("form").submit()

    cy.contains("#cards li", "What is a cloud?")
    cy.contains("#cards li", "What is a hedgehog?")
  })

  it("Prevents creation of empty cards", () => {
    cy.visit("/")

    cy.contains("Add New Card").click()

    cy.get("form").submit()

    cy.contains("Front Text")

    cy.contains("Create").should("not.exist")
  })

  it("Sanitizes dangerous input text", () => {
    const alertStub = cy.stub()

    cy.on("window:alert", alertStub)

    cy.visit("/")

    cy.contains("Add New Card").click()

    cy.getTextAreaForLabel("Front Text").type(
      "Hello <script>alert('hacked in script tag');</script>"
    )

    cy.get("form").submit()

    cy.getTextAreaForLabel("Back Text").type(
      '<img src="" onerror="alert(\'hacked in img error\');">'
    )

    cy.get("form")
      .submit()
      .then(() => {
        expect(alertStub).not.to.be.called
      })
  })
})
