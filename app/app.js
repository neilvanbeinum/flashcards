import "@shoelace-style/shoelace/dist/components/button/button.js"
import "@shoelace-style/shoelace/dist/components/input/input.js"
import "@shoelace-style/shoelace/dist/themes/light.css"
import "./main.scss"

import { STORAGE_KEY } from "./constants.js"
let cards = JSON.parse(window.localStorage[STORAGE_KEY] || "[]")

let testCards = []
let testInProgress = false
let currentTestCard

const cardsDOMList = document.querySelector("#cards")
const startTestButton = document.querySelector("#start-test")
const flipCardButton = document.querySelector("#flip-card")
const nextCardButton = document.querySelector("#next-card")
const frontTextInput = document.querySelector("#front-text")
const backTextInput = document.querySelector("#back-text")
const testContainer = document.querySelector("div#test-container")
const saveCardButton = document.querySelector("#save-btn")
const createCardForm = document.querySelector("form#create-card-form")
const cardDeckSummaryLink = document.querySelector("#card-deck-summary-link")

const addCard = (frontText, backText) => {
  frontText = frontText?.trim()
  backText = backText?.trim()

  const cardObj = { frontText, backText }

  Object.entries(cardObj).forEach(([textKey, textValue]) => {
    if (!textValue) {
      throw `${textKey} - value required but was blank`
    }
  })

  cards.push({
    ...cardObj,
    createdAt: Date.now(),
  })
}

const removeCardAt = (index) => {
  return () => {
    cards = [...cards.slice(0, index), ...cards.slice(index + 1)]

    saveToLocalStorage()
    displayCards()
  }
}

const saveToLocalStorage = () => {
  window.localStorage[STORAGE_KEY] = JSON.stringify(cards)
}

const toggleStartButtonEnabled = (isOn) => (startTestButton.disabled = !isOn)

const displayCards = () => {
  const cardFragments = cards.map((card, index) => {
    const fragment = document
      .createRange()
      .createContextualFragment(
        `<li>${card.frontText} - ${card.backText}<sl-button class="delete-card">Delete</sl-button></li>`
      )

    fragment
      .querySelector("sl-button.delete-card")
      .addEventListener("click", removeCardAt(index))

    return fragment
  })

  cardsDOMList.innerHTML = ""
  cardsDOMList.append(...cardFragments)

  toggleStartButtonEnabled(cards.length > 0)

  updateCardDeckSummaryLink()
}

const createCard = () => {
  const frontText = document.querySelector("#front-text")
  const backText = document.querySelector("#back-text")

  addCard(frontText.value, backText.value)
  saveToLocalStorage()
  displayCards()

  frontText.value = ""
  backText.value = ""
}

const displayCardText = (text) => {
  testContainer.innerHTML = `<p>${text}</p>`
}

const shiftAndDisplayNextCard = () => {
  currentTestCard = new CardTestPresenter(testCards.shift())
  displayCardText(currentTestCard.nextFaceText())

  if (testCards.length === 0) {
    nextCardButton.disabled = true
  }
}

const toggleCardListDisabled = (isDisabled) => {
  document
    .querySelectorAll(".delete-card")
    .forEach((button) => (button.disabled = isDisabled))
}

const toggleCardManagementInputsDisabled = (isDisabled) => {
  frontTextInput.disabled = isDisabled
  backTextInput.disabled = isDisabled
  saveCardButton.disabled = isDisabled
  toggleCardListDisabled(isDisabled)
}

const toggleCardTestInputsDisabled = (isDisabled) => {
  flipCardButton.disabled = isDisabled
  nextCardButton.disabled = isDisabled
}

const toggleTestStart = () => {
  if (!testInProgress) {
    testInProgress = true

    toggleCardManagementInputsDisabled(true)
    toggleCardTestInputsDisabled(false)
    startTestButton.innerText = "End Test"

    testCards = structuredClone(cards)

    shiftAndDisplayNextCard()
  } else {
    testInProgress = false

    toggleCardManagementInputsDisabled(false)
    toggleCardTestInputsDisabled(true)
    startTestButton.innerText = "Start Test"

    testContainer.innerHTML = ""
  }
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
  cardDeckSummaryLink.innerText = `Flashcards in deck (${cards.length})`
}

const toggleCardListVisibility = () => {
  cardsDOMList.hidden = !cardsDOMList.hidden
}

saveCardButton.addEventListener("click", createCard)
createCardForm.addEventListener("submit", (e) => {
  e.preventDefault()

  createCard()
})
startTestButton.addEventListener("click", toggleTestStart)
flipCardButton.addEventListener("click", flipCurrentTestCard)
nextCardButton.addEventListener("click", shiftAndDisplayNextCard)
cardDeckSummaryLink.addEventListener("click", toggleCardListVisibility)

updateCardDeckSummaryLink()
displayCards()
