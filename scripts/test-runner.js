#!/usr/bin/env node

/**
 * PharmaLink Test Runner
 * Comprehensive test execution script for all testing types
 */

const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

class TestRunner {
  constructor() {
    this.results = {
      unit: null,
      integration: null,
      e2e: null,
      performance: null,
    }
    this.startTime = Date.now()
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString()
    const colors = {
      info: '\x1b[36m',    // Cyan
      success: '\x1b[32m', // Green
      error: '\x1b[31m',   // Red
      warning: '\x1b[33m', // Yellow
      reset: '\x1b[0m'     // Reset
    }
    
    console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`)
  }

  async runCommand(command, args, options = {}) {
    return new Promise((resolve, reject) => {
      this.log(`Running: ${command} ${args.join(' ')}`)
      
      const child = spawn(command, args, {
        stdio: 'inherit',
        shell: true,
        ...options
      })

      child.on('close', (code) => {
        if (code === 0) {
          resolve(code)
        } else {
          reject(new Error(`Command failed with exit code ${code}`))
        }
      })

      child.on('error', (error) => {
        reject(error)
      })
    })
  }

  async runUnitTests() {
    this.log('🧪 Running Unit Tests...', 'info')
    try {
      await this.runCommand('npm', ['test', '--', '--coverage', '--watchAll=false'])
      this.results.unit = 'PASSED'
      this.log('✅ Unit tests passed!', 'success')
    } catch (error) {
      this.results.unit = 'FAILED'
      this.log('❌ Unit tests failed!', 'error')
      throw error
    }
  }

  async runIntegrationTests() {
    this.log('🔗 Running Integration Tests...', 'info')
    try {
      // Backend tests
      await this.runCommand('npm', ['test'], { cwd: path.join(process.cwd(), 'gemini-proxy') })
      this.results.integration = 'PASSED'
      this.log('✅ Integration tests passed!', 'success')
    } catch (error) {
      this.results.integration = 'FAILED'
      this.log('❌ Integration tests failed!', 'error')
      throw error
    }
  }

  async runE2ETests() {
    this.log('🎭 Running E2E Tests...', 'info')
    try {
      // Check if Cypress is installed
      if (!fs.existsSync(path.join(process.cwd(), 'node_modules', '.bin', 'cypress'))) {
        this.log('⚠️ Cypress not installed, skipping E2E tests', 'warning')
        this.results.e2e = 'SKIPPED'
        return
      }

      await this.runCommand('npx', ['cypress', 'run'])
      this.results.e2e = 'PASSED'
      this.log('✅ E2E tests passed!', 'success')
    } catch (error) {
      this.results.e2e = 'FAILED'
      this.log('❌ E2E tests failed!', 'error')
      throw error
    }
  }

  async runPerformanceTests() {
    this.log('⚡ Running Performance Tests...', 'info')
    try {
      // Check if Artillery is installed
      try {
        await this.runCommand('artillery', ['--version'])
      } catch {
        this.log('⚠️ Artillery not installed globally, skipping performance tests', 'warning')
        this.log('💡 Install with: npm install -g artillery', 'info')
        this.results.performance = 'SKIPPED'
        return
      }

      // Check if server is running
      const { spawn } = require('child_process')
      const checkServer = spawn('curl', ['-f', 'http://localhost:3000'], { stdio: 'ignore' })
      
      await new Promise((resolve) => {
        checkServer.on('close', (code) => {
          if (code !== 0) {
            this.log('⚠️ Server not running on localhost:3000, skipping performance tests', 'warning')
            this.log('💡 Start server with: npm run dev', 'info')
            this.results.performance = 'SKIPPED'
          }
          resolve()
        })
      })

      if (this.results.performance === 'SKIPPED') return

      await this.runCommand('artillery', ['run', 'performance/load-test.yml'])
      this.results.performance = 'PASSED'
      this.log('✅ Performance tests passed!', 'success')
    } catch (error) {
      this.results.performance = 'FAILED'
      this.log('❌ Performance tests failed!', 'error')
      throw error
    }
  }

  async runLinting() {
    this.log('🔍 Running Linting...', 'info')
    try {
      await this.runCommand('npm', ['run', 'lint'])
      this.log('✅ Linting passed!', 'success')
    } catch (error) {
      this.log('❌ Linting failed!', 'error')
      throw error
    }
  }

  async runTypeChecking() {
    this.log('📝 Running Type Checking...', 'info')
    try {
      await this.runCommand('npx', ['tsc', '--noEmit'])
      this.log('✅ Type checking passed!', 'success')
    } catch (error) {
      this.log('❌ Type checking failed!', 'error')
      throw error
    }
  }

  generateReport() {
    const endTime = Date.now()
    const duration = Math.round((endTime - this.startTime) / 1000)
    
    this.log('\n📊 Test Results Summary', 'info')
    this.log('========================', 'info')
    
    Object.entries(this.results).forEach(([testType, result]) => {
      const icon = result === 'PASSED' ? '✅' : result === 'FAILED' ? '❌' : '⚠️'
      const color = result === 'PASSED' ? 'success' : result === 'FAILED' ? 'error' : 'warning'
      this.log(`${icon} ${testType.toUpperCase()}: ${result}`, color)
    })
    
    this.log(`\n⏱️ Total execution time: ${duration}s`, 'info')
    
    const failedTests = Object.values(this.results).filter(result => result === 'FAILED')
    if (failedTests.length > 0) {
      this.log(`\n❌ ${failedTests.length} test suite(s) failed`, 'error')
      process.exit(1)
    } else {
      this.log('\n🎉 All tests passed!', 'success')
    }
  }

  async run(options = {}) {
    try {
      this.log('🚀 Starting PharmaLink Test Suite', 'info')
      
      // Pre-flight checks
      if (options.lint !== false) {
        await this.runLinting()
      }
      
      if (options.typecheck !== false) {
        await this.runTypeChecking()
      }

      // Run tests based on options
      if (options.unit !== false) {
        await this.runUnitTests()
      }

      if (options.integration !== false) {
        await this.runIntegrationTests()
      }

      if (options.e2e !== false) {
        await this.runE2ETests()
      }

      if (options.performance !== false) {
        await this.runPerformanceTests()
      }

      this.generateReport()
    } catch (error) {
      this.log(`💥 Test execution failed: ${error.message}`, 'error')
      this.generateReport()
    }
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2)
  const options = {}

  // Parse command line arguments
  args.forEach(arg => {
    if (arg.startsWith('--no-')) {
      const testType = arg.replace('--no-', '')
      options[testType] = false
    } else if (arg.startsWith('--only-')) {
      const testType = arg.replace('--only-', '')
      // Disable all others
      options.unit = false
      options.integration = false
      options.e2e = false
      options.performance = false
      options.lint = false
      options.typecheck = false
      // Enable only the specified one
      options[testType] = true
    }
  })

  const runner = new TestRunner()
  runner.run(options)
}

module.exports = TestRunner
