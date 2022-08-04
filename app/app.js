import "@shoelace-style/shoelace/dist/components/button/button.js"
import "@shoelace-style/shoelace/dist/components/input/input.js"
import "@shoelace-style/shoelace/dist/components/textarea/textarea.js"
import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js"
import "@shoelace-style/shoelace/dist/components/icon/icon.js"
import "@shoelace-style/shoelace/dist/components/card/card.js"
import "@shoelace-style/shoelace/dist/themes/light.css"
import "./main.scss"

import { serialize } from "@shoelace-style/shoelace/dist/utilities/form.js"

import { sanitize } from "dompurify"
import { Card } from "./card"
import { STORAGE_KEY } from "./constants"

Card.cards = JSON.parse(window.localStorage[STORAGE_KEY] || "[]")

let testCards = []
let testInProgress = false
let currentTestCard

let cardToCreate = {}

const removeCardAt = (index) => {
  return () => {
    Card.cards = [...Card.cards.slice(0, index), ...Card.cards.slice(index + 1)]

    saveAllCards()

    displayCards()
  }
}

const toggleStartButtonEnabled = (isOn) => {
  document.querySelector("#start-test").disabled = !isOn
}

const displayCards = () => {
  const cardFragments = Card.cards.map((card, index) => {
    const fragment = document
      .createRange()
      .createContextualFragment(
        `<li>${sanitize(card.frontText)} - ${sanitize(
          card.backText
        )}<sl-button name="trash" label="Delete card" class="delete-card" size="small" pill variant="danger" outline>Delete</sl-button></li>`
      )

    fragment
      .querySelector("sl-button.delete-card")
      .addEventListener("click", removeCardAt(index))

    return fragment
  })

  const cardsDOMList = document.querySelector("#cards")

  cardsDOMList.innerHTML = ""
  cardsDOMList.append(...cardFragments)

  toggleStartButtonEnabled(Card.cards.length > 0)
}

const displayCardText = (text) => {
  document.querySelector(
    "#test-container"
  ).innerHTML = `<sl-card>${text}</sl-card>`
}

const shiftAndDisplayNextCard = () => {
  currentTestCard = new CardTestPresenter(testCards.shift())
  displayCardText(currentTestCard.nextFaceText())

  if (testCards.length === 0) {
    const nextCardButton = document.querySelector("#next-card")

    nextCardButton.removeEventListener("click", shiftAndDisplayNextCard)

    nextCardButton.innerText = "End Test"

    nextCardButton.setAttribute("variant", "success")

    nextCardButton.addEventListener("click", renderIndex)
  }
}

const toggleCardListDisabled = (isDisabled) => {
  document
    .querySelectorAll(".delete-card")
    .forEach((button) => (button.disabled = isDisabled))
}

const flipCurrentTestCard = () => {
  displayCardText(currentTestCard.nextFaceText())
}

class CardTestPresenter {
  constructor(card) {
    this.card = card
    this.frontIsCurrentFace = true
  }

  nextFaceText() {
    const text = this.frontIsCurrentFace
      ? this.card.frontText
      : this.card.backText

    this.frontIsCurrentFace = !this.frontIsCurrentFace

    return text
  }
}

const updateCardDeckSummaryLink = () => {
  cardDeckSummaryLink.innerText = `Flashcards in deck (${Card.cards.length})`
}

const renderStepOne = () => {
  document.querySelector(".app-container").innerHTML = `
    <div>
      <a id="back-link" href="#">Back</a>
    </div>

    <form id="create-card-form">
      <div class="form-group">
        <label for="front-text">Front Text</label>
        <sl-textarea id="front-text" name="frontText" required></sl-textarea>
      </div>

      <sl-button id="next-btn" variant="neutral" type="submit">Next</sl-button>
    </form>
  `

  document.querySelector("#front-text").value = cardToCreate.frontText || ""

  document
    .querySelector("#create-card-form")
    .addEventListener("submit", (e) => {
      e.preventDefault()

      const form = document.querySelector("form")
      const data = serialize(form)

      cardToCreate = {
        ...cardToCreate,
        frontText: data.frontText,
      }

      onRouteChange("/cards/new/step2")
    })

  document.querySelector("#back-link").addEventListener("click", () => {
    cardToCreate = {}

    onRouteChange("/")
  })
}

const renderStepTwo = () => {
  document.querySelector(".app-container").innerHTML = `
    <a id="back-link" href="#">Back</a>

    <form id="create-card-form">
      <div class="form-group">
        <label for="back-text">Back Text</label>
        <sl-textarea id="back-text" name="backText" required></sl-textarea>
      </div>

      <sl-button id="next-btn" variant="success" type="submit">Create</sl-button>
    </form>
  `

  document.querySelector("#back-text").value = cardToCreate.backText || ""

  document
    .querySelector("#create-card-form")
    .addEventListener("submit", (e) => {
      e.preventDefault()

      const form = document.querySelector("form")
      const data = serialize(form)

      cardToCreate = {
        ...cardToCreate,
        backText: data.backText,
      }

      try {
        const card = new Card({ ...cardToCreate })
        Card.updateAll([...Card.cards, card])

        saveAllCards()
      } catch (error) {
        console.log(`Unable to create card: ${error}`)
      }
      onRouteChange("/")
    })

  document.querySelector("#back-link").addEventListener("click", () => {
    cardToCreate = {
      ...cardToCreate,
      backText: document.querySelector("#back-text").value,
    }
    onRouteChange("/cards/new/step1")
  })
}

const renderIndex = () => {
  const range = document.createRange()

  const fragment = range.createContextualFragment(`
    <div class="form-group">
      <a href="#" id="card-deck-summary-link"></a>
    </div>

    <ul id="cards"></ul>

    <sl-button id="add-new-card">Add New Card</sl-button>
    <sl-button id="start-test" variant="success">Start Test</sl-button>
  `)

  fragment.querySelector("#add-new-card").addEventListener("click", () => {
    cardToCreate = {}

    onRouteChange("/cards/new/step1")
  })

  fragment.querySelector("#start-test").addEventListener("click", () => {
    onRouteChange("/cards/test")
  })

  document.querySelector(".app-container").replaceChildren(fragment)

  displayCards()
}

const renderTest = () => {
  testCards = structuredClone(Card.cards)

  document.querySelector(".app-container").innerHTML = `
    <a id="back-link" href="#">Back</a>

    <div id="test-container"></div>

    <div class="form-group">
      <sl-button id="flip-card" variant="primary">Flip Card</sl-button>
    </div>

    <div class="form-group">
      <sl-button id="next-card" variant="neutral">Next Card</sl-button>
    </div>`

  document
    .querySelector("#flip-card")
    .addEventListener("click", flipCurrentTestCard)

  document
    .querySelector("#next-card")
    .addEventListener("click", shiftAndDisplayNextCard)

  document.querySelector("#back-link").addEventListener("click", renderIndex)

  shiftAndDisplayNextCard()
}

const routesToRenders = {
  "/": () => renderIndex(),
  "/cards/new/step1": () => renderStepOne(),
  "/cards/new/step2": () => renderStepTwo(),
  "/cards/test": () => renderTest(),
}

const onRouteChange = (newRoute) => {
  routesToRenders[newRoute]()
}

renderIndex()

const saveAllCards = () => {
  window.localStorage[STORAGE_KEY] = JSON.stringify(Card.cards)
}
