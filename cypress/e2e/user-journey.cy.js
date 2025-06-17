describe('PharmaLink User Journey', () => {
  const testUser = Cypress.env('testUser')

  beforeEach(() => {
    cy.visit('/')
    cy.waitForPageLoad()
  })

  describe('Homepage', () => {
    it('should display the homepage correctly', () => {
      cy.get('[data-testid="hero-section"]').should('be.visible')
      cy.get('[data-testid="search-section"]').should('be.visible')
      cy.get('[data-testid="featured-pharmacies"]').should('be.visible')
      
      // Check navigation
      cy.get('[data-testid="navigation"]').should('be.visible')
      cy.get('[data-testid="login-button"]').should('be.visible')
      cy.get('[data-testid="register-button"]').should('be.visible')
    })

    it('should have working search functionality', () => {
      cy.searchMedication('paracetamol')
      cy.url().should('include', '/search')
      cy.get('[data-testid="search-results"]').should('be.visible')
      cy.get('[data-testid="medication-card"]').should('have.length.greaterThan', 0)
    })

    it('should display nearby pharmacies on map', () => {
      cy.mockGeolocation()
      cy.get('[data-testid="find-nearby-button"]').click()
      cy.waitForMapLoad()
      cy.get('[data-testid="pharmacy-marker"]').should('have.length.greaterThan', 0)
    })
  })

  describe('User Authentication', () => {
    it('should allow user registration', () => {
      cy.get('[data-testid="register-button"]').click()
      cy.url().should('include', '/authentication')
      
      cy.fillForm({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      })
      
      cy.get('[data-testid="register-submit"]').click()
      cy.checkNotification('Registration successful')
      cy.url().should('not.include', '/authentication')
    })

    it('should allow user login', () => {
      cy.get('[data-testid="login-button"]').click()
      cy.url().should('include', '/authentication')
      
      cy.fillForm({
        email: testUser.email,
        password: testUser.password,
      })
      
      cy.get('[data-testid="login-submit"]').click()
      cy.checkNotification('Login successful')
      cy.get('[data-testid="user-menu"]').should('be.visible')
    })

    it('should handle login errors', () => {
      cy.intercept('POST', '/api/auth/login', {
        statusCode: 401,
        body: { error: 'Invalid credentials' },
      }).as('loginError')

      cy.get('[data-testid="login-button"]').click()
      cy.fillForm({
        email: 'wrong@example.com',
        password: 'wrongpassword',
      })
      
      cy.get('[data-testid="login-submit"]').click()
      cy.checkErrorMessage('Invalid credentials')
    })
  })

  describe('Medication Search and Purchase', () => {
    beforeEach(() => {
      cy.login(testUser.email, testUser.password)
    })

    it('should complete full purchase journey', () => {
      // Search for medication
      cy.searchMedication('paracetamol')
      
      // Select a medication
      cy.get('[data-testid="medication-card"]').first().click()
      cy.url().should('include', '/drug/')
      
      // Add to cart
      cy.get('[data-testid="add-to-cart"]').click()
      cy.checkNotification('Added to cart')
      
      // View cart
      cy.viewCart()
      cy.get('[data-testid="cart-item"]').should('have.length', 1)
      
      // Proceed to checkout
      cy.checkout()
      
      // Fill delivery information
      cy.fillForm({
        address: '123 Test Street, Yaoundé',
        phone: '+237123456789',
        notes: 'Test delivery notes',
      })
      
      // Select payment method
      cy.get('[data-testid="payment-notchpay"]').click()
      
      // Mock successful payment
      cy.mockPaymentGateway(true)
      
      // Complete order
      cy.get('[data-testid="place-order"]').click()
      cy.waitForApiCall('@paymentSuccess')
      
      // Verify order confirmation
      cy.checkNotification('Order placed successfully')
      cy.url().should('include', '/orders/')
      cy.get('[data-testid="order-confirmation"]').should('be.visible')
    })

    it('should handle payment failure', () => {
      cy.searchMedication('paracetamol')
      cy.get('[data-testid="medication-card"]').first().click()
      cy.addToCart('1')
      cy.checkout()
      
      cy.fillForm({
        address: '123 Test Street, Yaoundé',
        phone: '+237123456789',
      })
      
      cy.mockPaymentGateway(false)
      cy.get('[data-testid="place-order"]').click()
      cy.waitForApiCall('@paymentFailure')
      
      cy.checkErrorMessage('Payment failed')
      cy.url().should('include', '/checkout')
    })

    it('should filter medications by category', () => {
      cy.visit('/search')
      
      cy.get('[data-testid="category-filter"]').select('Pain Relief')
      cy.get('[data-testid="apply-filters"]').click()
      
      cy.get('[data-testid="medication-card"]').each(($card) => {
        cy.wrap($card).should('contain.text', 'Pain Relief')
      })
    })

    it('should sort medications by price', () => {
      cy.visit('/search')
      
      cy.get('[data-testid="sort-select"]').select('price-low-high')
      
      let previousPrice = 0
      cy.get('[data-testid="medication-price"]').each(($price) => {
        const currentPrice = parseInt($price.text().replace(/[^\d]/g, ''))
        expect(currentPrice).to.be.at.least(previousPrice)
        previousPrice = currentPrice
      })
    })
  })

  describe('Pharmacy Map Features', () => {
    beforeEach(() => {
      cy.mockGeolocation()
    })

    it('should show pharmacy details on marker click', () => {
      cy.visit('/search')
      cy.waitForMapLoad()
      
      cy.clickMapMarker('Test Pharmacy')
      cy.get('[data-testid="pharmacy-popup"]').should('be.visible')
      cy.get('[data-testid="pharmacy-name"]').should('contain.text', 'Test Pharmacy')
      cy.get('[data-testid="pharmacy-address"]').should('be.visible')
      cy.get('[data-testid="pharmacy-phone"]').should('be.visible')
    })

    it('should provide directions to pharmacy', () => {
      cy.visit('/search')
      cy.waitForMapLoad()
      
      cy.clickMapMarker('Test Pharmacy')
      cy.get('[data-testid="get-directions"]').click()
      
      // Should show route on map
      cy.get('[data-testid="route-line"]').should('be.visible')
      cy.get('[data-testid="directions-panel"]').should('be.visible')
    })

    it('should filter pharmacies by distance', () => {
      cy.visit('/search')
      cy.get('[data-testid="distance-filter"]').select('5km')
      cy.get('[data-testid="apply-filters"]').click()
      
      cy.waitForMapLoad()
      cy.get('[data-testid="pharmacy-marker"]').should('have.length.lessThan', 10)
    })
  })

  describe('Real-time Features', () => {
    beforeEach(() => {
      cy.login(testUser.email, testUser.password)
      cy.mockWebSocket()
    })

    it('should receive real-time order updates', () => {
      // Place an order first
      cy.visit('/orders/123') // Mock order ID
      
      // Simulate real-time update
      cy.simulateWebSocketMessage({
        type: 'order_update',
        orderId: '123',
        status: 'preparing',
        message: 'Your order is being prepared',
      })
      
      cy.get('[data-testid="order-status"]').should('contain.text', 'Preparing')
      cy.checkNotification('Your order is being prepared')
    })

    it('should show live chat with pharmacy', () => {
      cy.visit('/drug/123')
      cy.get('[data-testid="chat-with-pharmacy"]').click()
      
      cy.get('[data-testid="chat-window"]').should('be.visible')
      cy.get('[data-testid="chat-input"]').type('Is this medication available?')
      cy.get('[data-testid="send-message"]').click()
      
      // Simulate pharmacy response
      cy.simulateWebSocketMessage({
        type: 'chat_message',
        from: 'pharmacy',
        message: 'Yes, it is available',
        timestamp: new Date().toISOString(),
      })
      
      cy.get('[data-testid="chat-message"]').last().should('contain.text', 'Yes, it is available')
    })
  })

  describe('PWA Features', () => {
    it('should show install prompt', () => {
      cy.checkPWAInstallPrompt()
      cy.get('[data-testid="pwa-install-button"]').click()
      cy.checkNotification('App installed successfully')
    })

    it('should work offline', () => {
      cy.login(testUser.email, testUser.password)
      cy.visit('/search')
      
      // Go offline
      cy.goOffline()
      
      // Should show offline indicator
      cy.get('[data-testid="offline-indicator"]').should('be.visible')
      
      // Should still show cached content
      cy.get('[data-testid="medication-card"]').should('be.visible')
      
      // Try to add to cart (should queue for sync)
      cy.get('[data-testid="medication-card"]').first().click()
      cy.get('[data-testid="add-to-cart"]').click()
      cy.checkNotification('Added to cart (will sync when online)')
    })
  })

  describe('Accessibility', () => {
    it('should be accessible', () => {
      cy.checkA11y()
    })

    it('should support keyboard navigation', () => {
      cy.get('body').tab()
      cy.focused().should('have.attr', 'data-testid', 'skip-to-content')
      
      cy.navigateWithKeyboard(['Tab', 'Tab', 'Tab'])
      cy.focused().should('have.attr', 'data-testid', 'search-input')
    })

    it('should have proper focus management in modals', () => {
      cy.openModal('[data-testid="login-button"]')
      cy.focused().should('have.attr', 'data-testid', 'email-input')
      
      cy.get('body').type('{esc}')
      cy.focused().should('have.attr', 'data-testid', 'login-button')
    })
  })

  describe('Performance', () => {
    it('should load quickly', () => {
      cy.measurePageLoad()
    })

    it('should handle large lists efficiently', () => {
      cy.visit('/search?category=all')
      cy.scrollToBottom()
      cy.waitForInfiniteScroll()
      
      // Should load more items
      cy.get('[data-testid="medication-card"]').should('have.length.greaterThan', 20)
    })
  })
})
