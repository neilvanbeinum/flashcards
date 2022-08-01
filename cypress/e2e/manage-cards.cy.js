describe("Managing a card deck", () => {
  it("Allows card creation and deletion", () => {
    cy.visit("/")

    cy.getInputForLabel("Front Text").type("What is a cloud?")
    cy.getInputForLabel("Back Text").type("Water vapour in the sky")

    cy.get("#create-card-form").submit()

    cy.contains("What is a cloud? - Water vapour in the sky").should(
      "be.hidden"
    )

    cy.contains("Flashcards in deck (1)").click()

    cy.contains("What is a cloud? - Water vapour in the sky").should(
      "be.visible"
    )

    cy.get("#cards li").should(
      "have.arrayElements",
      1,
      "What is a cloud? - Water vapour in the sky"
    )

    cy.contains("Flashcards in deck (1)").click()

    cy.contains("What is a cloud? - Water vapour in the sky").should(
      "be.hidden"
    )

    cy.getInputForLabel("Front Text").type("What is a hedgehog?")
    cy.getInputForLabel("Back Text").type("Spiky rodent that lives in hedges")

    cy.get("#create-card-form").submit()

    cy.contains("Flashcards in deck (2)").click()

    cy.get("#cards li").should(
      "have.arrayElements",
      2,
      "What is a cloud? - Water vapour in the sky",
      "What is a hedgehog? - Spiky rodent that lives in hedges"
    )

    cy.get("#cards li").eq(0).contains("Delete").click()

    cy.get("#cards li").should(
      "have.arrayElements",
      1,
      "What is a hedgehog? - Spiky rodent that lives in hedges"
    )

    cy.getInputForLabel("Front Text").type("What is a bee?")
    cy.getInputForLabel("Back Text").type("Striped insect that loves nectar")

    cy.get("#create-card-form").submit()

    cy.get("#cards li").should(
      "have.arrayElements",
      2,
      "What is a hedgehog? - Spiky rodent that lives in hedges",
      "What is a bee? - Striped insect that loves nectar"
    )

    cy.get("#cards li").eq(0).contains("Delete").click()
    cy.get("#cards li").eq(0).contains("Delete").click()

    cy.get("#cards li").should("have.arrayElements", 0)
  })

  context("Using the keyboard", () => {
    it("Allows card creation", () => {
      cy.visit("/")

      cy.getInputForLabel("Front Text").type("What is a cloud?")
      cy.getInputForLabel("Back Text").type("Water vapour in the sky {enter}")

      cy.contains("Flashcards in deck (1)")
    })
  })

  it("Prevents creation of empty cards", () => {
    cy.visit("/")

    cy.contains("Flashcards in deck (0)")

    cy.get("#create-card-form").submit()

    cy.contains("Flashcards in deck (0)")
  })

  it("Sanitizes dangerous input text", () => {
    const alertStub = cy.stub()

    cy.on("window:alert", alertStub)

    cy.visit("/")

    cy.getInputForLabel("Front Text").type(
      "<script>alert('hacked in script tag');</script>"
    )
    cy.getInputForLabel("Back Text").type(
      '<img src="" onerror="alert(\'hacked in img error\');">'
    )

    cy.get("#create-card-form")
      .submit()
      .then(() => {
        expect(alertStub).not.to.be.called
      })
  })
})
