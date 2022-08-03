const view = {
  cardFrontForm: function () {
    return `
      <div>
        <div>
          <label for="front-text">Front Text</label>
          <sl-textarea id="front-text" required></sl-textarea>
        </div>

        <sl-button id="save-btn" variant="primary">Next</sl-button>
      </div>
    `
  },
  cardBackForm: function () {
    return `
      <div>
        <div>
          <label for="front-text">Back Text</label>
          <sl-textarea id="back-text" required></sl-textarea>
        </div>

        <a href="" id="back-link">Back</a>
        <sl-button id="save-btn" variant="primary">Create Card</sl-button>
      </div>
    `
  },
}

export default view
