import { Card } from "./card"

describe("Card Model", () => {
  describe(".all", () => {
    beforeEach(() => {
      Card.cards = [
        {
          frontText: "front1",
          backText: "back1",
        },
        {
          frontText: "front2",
          backText: "back2",
        },
      ]
    })

    it("retrieves all cards", () => {
      expect(Card.all()).toEqual([
        {
          frontText: "front1",
          backText: "back1",
        },
        {
          frontText: "front2",
          backText: "back2",
        },
      ])
    })
  })

  describe(".create", () => {
    it("calls the storage update method", () => {
      Card.updateAll([
        {
          frontText: "front1",
          backText: "back1",
        },
      ])

      expect(Card.cards).toEqual([
        {
          frontText: "front1",
          backText: "back1",
        },
      ])
    })
  })

  describe("new", () => {
    it("throws an error if values are missing or blank", () => {
      expect(() => {
        new Card({ frontText: "" })
      }).toThrow("frontText - value required")

      expect(() => {
        new Card({ frontText: "text", backText: "" })
      }).toThrow("backText - value required")
    })
  })

  describe("save", () => {
    it("saves to Cards", () => {
      const card = new Card({ frontText: "frontText", backText: "backText" })

      card.save()

      expect(Card.cards).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            frontText: "frontText",
            backText: "backText",
          }),
        ])
      )
    })
  })
})
