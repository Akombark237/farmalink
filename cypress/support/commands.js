// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })

// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })

// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Custom command for testing accessibility
Cypress.Commands.add('checkA11y', (context = null, options = null) => {
  cy.injectAxe()
  cy.checkA11y(context, options)
})

// Custom command for testing responsive design
Cypress.Commands.add('testResponsive', (callback) => {
  const viewports = [
    { width: 375, height: 667, name: 'mobile' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 1280, height: 720, name: 'desktop' },
  ]

  viewports.forEach((viewport) => {
    cy.viewport(viewport.width, viewport.height)
    cy.log(`Testing on ${viewport.name} (${viewport.width}x${viewport.height})`)
    callback(viewport)
  })
})

// Custom command for testing PWA functionality
Cypress.Commands.add('checkPWAInstallPrompt', () => {
  cy.window().then((win) => {
    // Simulate PWA install prompt
    const beforeInstallPromptEvent = new Event('beforeinstallprompt')
    beforeInstallPromptEvent.prompt = cy.stub().resolves({ outcome: 'accepted' })
    win.dispatchEvent(beforeInstallPromptEvent)
  })
  
  cy.get('[data-testid="pwa-install-button"]').should('be.visible')
})

// Custom command for testing offline functionality
Cypress.Commands.add('goOffline', () => {
  cy.window().then((win) => {
    win.navigator.serviceWorker.ready.then((registration) => {
      registration.sync.register('background-sync')
    })
  })
  
  // Simulate offline mode
  cy.intercept('**', { forceNetworkError: true })
})

Cypress.Commands.add('goOnline', () => {
  // Remove offline intercepts
  cy.intercept('**').as('onlineRequests')
})

// Custom command for testing real-time features
Cypress.Commands.add('mockWebSocket', () => {
  cy.window().then((win) => {
    const mockSocket = {
      send: cy.stub(),
      close: cy.stub(),
      addEventListener: cy.stub(),
      removeEventListener: cy.stub(),
      readyState: 1, // OPEN
    }
    
    win.WebSocket = cy.stub().returns(mockSocket)
    win.mockSocket = mockSocket
  })
})

Cypress.Commands.add('simulateWebSocketMessage', (data) => {
  cy.window().then((win) => {
    if (win.mockSocket) {
      const event = new MessageEvent('message', { data: JSON.stringify(data) })
      win.mockSocket.onmessage(event)
    }
  })
})

// Custom command for testing payment flow
Cypress.Commands.add('mockPaymentGateway', (success = true) => {
  if (success) {
    cy.intercept('POST', '**/notchpay/**', {
      statusCode: 200,
      body: {
        success: true,
        transaction_id: 'test_txn_123',
        status: 'completed',
        amount: 10000,
        currency: 'CFA',
      },
    }).as('paymentSuccess')
  } else {
    cy.intercept('POST', '**/notchpay/**', {
      statusCode: 400,
      body: {
        success: false,
        error: 'Payment failed',
        code: 'INSUFFICIENT_FUNDS',
      },
    }).as('paymentFailure')
  }
})

// Custom command for testing geolocation
Cypress.Commands.add('mockGeolocation', (latitude = 3.848, longitude = 11.502) => {
  cy.window().then((win) => {
    const mockGeolocation = {
      getCurrentPosition: cy.stub().callsFake((success) => {
        success({
          coords: {
            latitude,
            longitude,
            accuracy: 100,
          },
        })
      }),
      watchPosition: cy.stub(),
      clearWatch: cy.stub(),
    }
    
    Object.defineProperty(win.navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true,
    })
  })
})

// Custom command for testing file uploads
Cypress.Commands.add('uploadFile', (selector, fileName, fileType = 'image/jpeg') => {
  cy.get(selector).then((subject) => {
    cy.fixture(fileName, 'base64').then((fileContent) => {
      const blob = Cypress.Blob.base64StringToBlob(fileContent, fileType)
      const file = new File([blob], fileName, { type: fileType })
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)
      
      subject[0].files = dataTransfer.files
      subject[0].dispatchEvent(new Event('change', { bubbles: true }))
    })
  })
})

// Custom command for testing drag and drop
Cypress.Commands.add('dragAndDrop', (sourceSelector, targetSelector) => {
  cy.get(sourceSelector).trigger('mousedown', { button: 0 })
  cy.get(targetSelector).trigger('mousemove').trigger('mouseup')
})

// Custom command for testing infinite scroll
Cypress.Commands.add('scrollToBottom', () => {
  cy.window().then((win) => {
    win.scrollTo(0, win.document.body.scrollHeight)
  })
})

Cypress.Commands.add('waitForInfiniteScroll', () => {
  cy.get('[data-testid="loading-more"]').should('be.visible')
  cy.get('[data-testid="loading-more"]').should('not.exist')
})

// Custom command for testing modals and overlays
Cypress.Commands.add('openModal', (triggerSelector) => {
  cy.get(triggerSelector).click()
  cy.get('[data-testid="modal"]').should('be.visible')
  cy.get('[data-testid="modal-backdrop"]').should('be.visible')
})

Cypress.Commands.add('closeModal', () => {
  cy.get('[data-testid="modal-close"]').click()
  cy.get('[data-testid="modal"]').should('not.exist')
})

// Custom command for testing keyboard navigation
Cypress.Commands.add('navigateWithKeyboard', (keys) => {
  keys.forEach((key) => {
    cy.focused().type(`{${key}}`)
  })
})

// Custom command for testing focus management
Cypress.Commands.add('checkFocusOrder', (selectors) => {
  selectors.forEach((selector, index) => {
    if (index === 0) {
      cy.get(selector).focus()
    } else {
      cy.focused().tab()
    }
    cy.focused().should('match', selector)
  })
})

// Custom command for testing loading states
Cypress.Commands.add('waitForLoadingToFinish', (timeout = 10000) => {
  cy.get('[data-testid="loading"]', { timeout }).should('not.exist')
  cy.get('[data-testid="spinner"]', { timeout }).should('not.exist')
  cy.get('[data-testid="skeleton"]', { timeout }).should('not.exist')
})

// Custom command for testing error states
Cypress.Commands.add('triggerError', (endpoint, errorCode = 500) => {
  cy.intercept('GET', endpoint, {
    statusCode: errorCode,
    body: { error: 'Internal server error' },
  }).as('errorResponse')
})

Cypress.Commands.add('checkErrorMessage', (message) => {
  cy.get('[data-testid="error-message"]')
    .should('be.visible')
    .and('contain.text', message)
})

// Custom command for testing performance
Cypress.Commands.add('measurePageLoad', () => {
  cy.window().then((win) => {
    const performance = win.performance
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart
    cy.log(`Page load time: ${loadTime}ms`)
    expect(loadTime).to.be.lessThan(5000) // Should load in less than 5 seconds
  })
})
