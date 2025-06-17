const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        log(message) {
          console.log(message)
          return null
        },
      })
    },
    env: {
      // Environment variables for testing
      apiUrl: 'http://localhost:3000/api',
      geminiApiUrl: 'http://localhost:3001',
      testUser: {
        email: 'test@pharmalink.com',
        password: 'testpassword123',
        name: 'Test User',
      },
      testPharmacy: {
        name: 'Test Pharmacy',
        address: 'Test Address, Yaoundé',
        phone: '+237123456789',
      },
    },
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    supportFile: 'cypress/support/component.js',
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
    indexHtmlFile: 'cypress/support/component-index.html',
  },
  retries: {
    runMode: 2,
    openMode: 0,
  },
  watchForFileChanges: false,
  chromeWebSecurity: false,
  modifyObstructiveCode: false,
  blockHosts: [
    // Block external analytics and tracking
    '*.google-analytics.com',
    '*.googletagmanager.com',
    '*.facebook.com',
    '*.twitter.com',
  ],
})
