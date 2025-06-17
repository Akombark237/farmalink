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
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log
const app = window.top
if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style')
  style.innerHTML = '.command-name-request, .command-name-xhr { display: none }'
  style.setAttribute('data-hide-command-log-request', '')
  app.document.head.appendChild(style)
}

// Global error handling
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  // on uncaught exceptions that we expect in our app
  
  // Don't fail on hydration errors in development
  if (err.message.includes('Hydration failed')) {
    return false
  }
  
  // Don't fail on Next.js chunk loading errors
  if (err.message.includes('Loading chunk')) {
    return false
  }
  
  // Don't fail on network errors during testing
  if (err.message.includes('NetworkError')) {
    return false
  }
  
  // Don't fail on ResizeObserver errors
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false
  }
  
  // Let other errors fail the test
  return true
})

// Custom commands for authentication
Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
    cy.visit('/authentication')
    cy.get('[data-testid="email-input"]').type(email)
    cy.get('[data-testid="password-input"]').type(password)
    cy.get('[data-testid="login-button"]').click()
    cy.url().should('not.include', '/authentication')
    cy.get('[data-testid="user-menu"]').should('be.visible')
  })
})

Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="user-menu"]').click()
  cy.get('[data-testid="logout-button"]').click()
  cy.url().should('include', '/')
  cy.get('[data-testid="login-button"]').should('be.visible')
})

// Custom commands for API interactions
Cypress.Commands.add('apiLogin', (email, password) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/auth/login`,
    body: { email, password },
  }).then((response) => {
    window.localStorage.setItem('authToken', response.body.token)
    window.localStorage.setItem('user', JSON.stringify(response.body.user))
  })
})

Cypress.Commands.add('apiRequest', (method, endpoint, body = null) => {
  const token = window.localStorage.getItem('authToken')
  
  return cy.request({
    method,
    url: `${Cypress.env('apiUrl')}${endpoint}`,
    body,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    failOnStatusCode: false,
  })
})

// Custom commands for database operations
Cypress.Commands.add('seedDatabase', () => {
  cy.task('seedDatabase')
})

Cypress.Commands.add('cleanDatabase', () => {
  cy.task('cleanDatabase')
})

// Custom commands for waiting
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('[data-testid="loading"]', { timeout: 30000 }).should('not.exist')
  cy.get('body').should('be.visible')
})

Cypress.Commands.add('waitForApiCall', (alias) => {
  cy.wait(alias).then((interception) => {
    expect(interception.response.statusCode).to.be.oneOf([200, 201, 204])
  })
})

// Custom commands for form interactions
Cypress.Commands.add('fillForm', (formData) => {
  Object.keys(formData).forEach((field) => {
    cy.get(`[data-testid="${field}-input"]`).clear().type(formData[field])
  })
})

Cypress.Commands.add('submitForm', (formTestId = 'form') => {
  cy.get(`[data-testid="${formTestId}"]`).submit()
})

// Custom commands for notifications
Cypress.Commands.add('checkNotification', (message, type = 'success') => {
  cy.get(`[data-testid="notification-${type}"]`)
    .should('be.visible')
    .and('contain.text', message)
})

// Custom commands for map interactions
Cypress.Commands.add('waitForMapLoad', () => {
  cy.get('[data-testid="map-container"]', { timeout: 10000 }).should('be.visible')
  cy.get('.leaflet-map-pane', { timeout: 10000 }).should('be.visible')
})

Cypress.Commands.add('clickMapMarker', (pharmacyName) => {
  cy.get(`[data-testid="marker-${pharmacyName}"]`).click()
  cy.get('[data-testid="popup"]').should('be.visible')
})

// Custom commands for search functionality
Cypress.Commands.add('searchMedication', (medicationName) => {
  cy.get('[data-testid="search-input"]').clear().type(medicationName)
  cy.get('[data-testid="search-button"]').click()
  cy.waitForPageLoad()
})

// Custom commands for cart operations
Cypress.Commands.add('addToCart', (medicationId, quantity = 1) => {
  cy.get(`[data-testid="add-to-cart-${medicationId}"]`).click()
  if (quantity > 1) {
    cy.get('[data-testid="quantity-input"]').clear().type(quantity.toString())
    cy.get('[data-testid="update-quantity"]').click()
  }
  cy.checkNotification('Added to cart')
})

Cypress.Commands.add('viewCart', () => {
  cy.get('[data-testid="cart-icon"]').click()
  cy.get('[data-testid="cart-sidebar"]').should('be.visible')
})

Cypress.Commands.add('checkout', () => {
  cy.get('[data-testid="checkout-button"]').click()
  cy.url().should('include', '/checkout')
})

// Custom commands for mobile testing
Cypress.Commands.add('setMobileViewport', () => {
  cy.viewport(375, 667) // iPhone SE dimensions
})

Cypress.Commands.add('setTabletViewport', () => {
  cy.viewport(768, 1024) // iPad dimensions
})

Cypress.Commands.add('setDesktopViewport', () => {
  cy.viewport(1280, 720) // Desktop dimensions
})

// Before each test
beforeEach(() => {
  // Clear local storage
  cy.clearLocalStorage()
  
  // Clear cookies
  cy.clearCookies()
  
  // Set up API intercepts for common endpoints
  cy.intercept('GET', '/api/pharmacies*', { fixture: 'pharmacies.json' }).as('getPharmacies')
  cy.intercept('GET', '/api/medications*', { fixture: 'medications.json' }).as('getMedications')
  cy.intercept('POST', '/api/auth/login', { fixture: 'auth/login.json' }).as('login')
  cy.intercept('POST', '/api/orders', { fixture: 'orders/create.json' }).as('createOrder')
})
