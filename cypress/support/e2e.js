// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands"

// Alternatively you can use CommonJS syntax:
// require('./commands')

/* global chai */
// because this file is imported from cypress/support/e2e.js
// that means all other spec files will have this assertion plugin
// available to them because the supportFile is bundled and served
// prior to any spec files loading

/**
 * Example that shows how to write a custom Chai assertion.
 *
 * @see https://www.chaijs.com/guide/helpers/
 * @example
 ```
  expect('foo').to.be.foo()
  expect('bar').to.not.be.foo()
  cy.wrap('foo').should('be.foo')
  cy.wrap('bar').should('not.be.foo')
```
 * */
const arrayElements = (_chai, utils) => {
  function assertArrayElements(length, ...itemTexts) {
    assert.equal(this._obj.length, length)

    itemTexts.forEach((itemText, i) => {
      assert.include(this._obj.eq(i).text(), itemText)
    })
  }

  _chai.Assertion.addMethod("arrayElements", assertArrayElements)
}

// registers our assertion function "isFoo" with Chai
chai.use(arrayElements)

Cypress.on("uncaught:exception", (err, runnable) => {
  if (err.message.match(/Error resolving module specifier “application”/)) {
    return false
  }
})

// Cypress.on("uncaught:exception", (err, runnable) => {
//   // returning false here prevents Cypress from
//   // failing the test
//   return false;
// });
