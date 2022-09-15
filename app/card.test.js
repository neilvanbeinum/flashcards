import Card from "./card"
import Storage from "./storage"

jest.mock("./storage")

describe("Card Model", () => {
  describe(".all", () => {
    it("makes a call to storage to fetch all cards", () => {
      Storage.getRecords = jest.fn(() => [
        { frontText: "frontText", backText: "backText" },
      ])

      expect(Card.all()).toEqual([
        expect.objectContaining({
          frontText: "frontText",
          backText: "backText",
        }),
      ])

      expect(Storage.getRecords).toHaveBeenCalled()
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

    it("instantiates a Card with the supplied fields", () => {
      const card = new Card({ frontText: "frontText", backText: "backText" })

      expect(card.frontText).toEqual("frontText")
      expect(card.backText).toEqual("backText")
    })
  })

  describe("save", () => {
    it("makes a call to storage to save the card", () => {
      const card = new Card({ frontText: "frontText", backText: "backText" })

      card.save()

      expect(Storage.createRecord).toHaveBeenCalledWith(card)
    })
  })

  describe("delete", () => {
    it("makes a call to storage to delete the card", () => {
      const card = new Card({ frontText: "frontText", backText: "backText" })

      card.save()

      card.delete()

      expect(Storage.deleteRecord).toHaveBeenCalledWith(card)
    })
  })
})
