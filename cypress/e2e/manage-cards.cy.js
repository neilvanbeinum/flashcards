describe("Managing a card deck", () => {
  it("Allows card creation and deletion", () => {
    cy.visit("/")

    cy.contains("a", "Add New Card").click()

    cy.getTextAreaForLabel("Front Text").type("What is a cloud? TYPO")
    cy.contains('input[type="submit"]', "Next").click()

    cy.getTextAreaForLabel("Back Text").type("Water vapour in the sky")

    cy.contains("a", "Back").click()

    cy.getTextAreaForLabel("Front Text").clear({ force: true })

    cy.getTextAreaForLabel("Front Text").type("What is a cloud?", {
      force: true,
    })

    cy.contains('input[type="submit"]', "Next").click()

    cy.getTextAreaForLabel("Back Text").should(
      "have.value",
      "Water vapour in the sky"
    )

    cy.contains('input[type="submit"]', "Create").click()

    cy.contains("#cards li", "What is a cloud?")

    cy.contains("a", "Add New Card").click()

    cy.getTextAreaForLabel("Front Text").type("What is a hedgehog?")

    cy.contains('input[type="submit"]', "Next").click()

    cy.getTextAreaForLabel("Back Text").type(
      "Spiky rodent that lives in hedges"
    )

    cy.contains('input[type="submit"]', "Create").click()

    cy.contains("#cards li", "What is a cloud?")
    cy.contains("#cards li", "What is a hedgehog?")
  })

  it("Prevents creation of empty cards", () => {
    cy.visit("/")

    cy.contains("a", "Add New Card").click()

    cy.contains("Front Text")

    cy.url().then((newCardUrl) => {
      cy.contains('input[type="submit"]', "Next").click()

      cy.url().then((currentUrl) => {
        expect(currentUrl).to.eq(newCardUrl)
      })
    })
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
