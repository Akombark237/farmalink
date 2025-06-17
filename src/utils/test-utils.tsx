import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { AuthProvider } from '@/contexts/AuthContext'

// Mock providers for testing
const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const mockAuthValue = {
    user: null,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
    loading: false,
    isAuthenticated: false,
  }

  return (
    <AuthProvider value={mockAuthValue}>
      {children}
    </AuthProvider>
  )
}

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <MockAuthProvider>
      {children}
    </MockAuthProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Test data factories
export const createMockUser = (overrides = {}) => ({
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
  created_at: new Date().toISOString(),
  ...overrides,
})

export const createMockPharmacy = (overrides = {}) => ({
  id: '1',
  name: 'Test Pharmacy',
  address: '123 Test Street, Yaoundé',
  phone: '+237123456789',
  latitude: 3.848,
  longitude: 11.502,
  hours: '8:00 AM - 8:00 PM',
  rating: 4.5,
  ...overrides,
})

export const createMockMedication = (overrides = {}) => ({
  id: '1',
  name: 'Test Medication',
  description: 'Test medication description',
  price: 5000,
  currency: 'CFA',
  category: 'General',
  requires_prescription: false,
  in_stock: true,
  pharmacy_id: '1',
  ...overrides,
})

export const createMockOrder = (overrides = {}) => ({
  id: '1',
  user_id: '1',
  pharmacy_id: '1',
  status: 'pending',
  total_amount: 10000,
  currency: 'CFA',
  items: [
    {
      medication_id: '1',
      quantity: 2,
      price: 5000,
    },
  ],
  created_at: new Date().toISOString(),
  ...overrides,
})

// Mock API responses
export const mockApiResponse = (data: any, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: () => Promise.resolve(data),
  text: () => Promise.resolve(JSON.stringify(data)),
})

// Mock fetch for API calls
export const mockFetch = (response: any, status = 200) => {
  global.fetch = jest.fn().mockResolvedValue(mockApiResponse(response, status))
}

// Mock error response
export const mockFetchError = (error: string, status = 500) => {
  global.fetch = jest.fn().mockRejectedValue(new Error(error))
}

// Wait for async operations
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock localStorage helpers
export const mockLocalStorage = () => {
  const store: { [key: string]: string } = {}
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    }),
  }
}

// Mock WebSocket for real-time features
export const mockWebSocket = () => {
  const listeners: { [event: string]: Function[] } = {}
  
  return {
    send: jest.fn(),
    close: jest.fn(),
    addEventListener: jest.fn((event: string, callback: Function) => {
      if (!listeners[event]) listeners[event] = []
      listeners[event].push(callback)
    }),
    removeEventListener: jest.fn((event: string, callback: Function) => {
      if (listeners[event]) {
        listeners[event] = listeners[event].filter(cb => cb !== callback)
      }
    }),
    dispatchEvent: jest.fn((event: string, data?: any) => {
      if (listeners[event]) {
        listeners[event].forEach(callback => callback(data))
      }
    }),
    readyState: 1, // OPEN
  }
}

// Mock geolocation
export const mockGeolocation = () => {
  const mockGeolocation = {
    getCurrentPosition: jest.fn((success) => {
      success({
        coords: {
          latitude: 3.848,
          longitude: 11.502,
          accuracy: 100,
        },
      })
    }),
    watchPosition: jest.fn(),
    clearWatch: jest.fn(),
  }
  
  Object.defineProperty(global.navigator, 'geolocation', {
    value: mockGeolocation,
    writable: true,
  })
  
  return mockGeolocation
}

// Mock notification API
export const mockNotification = () => {
  const mockNotification = {
    permission: 'granted',
    requestPermission: jest.fn().mockResolvedValue('granted'),
  }
  
  Object.defineProperty(global, 'Notification', {
    value: jest.fn().mockImplementation((title, options) => ({
      title,
      ...options,
      close: jest.fn(),
    })),
    writable: true,
  })
  
  Object.defineProperty(global.Notification, 'permission', {
    value: mockNotification.permission,
    writable: true,
  })
  
  Object.defineProperty(global.Notification, 'requestPermission', {
    value: mockNotification.requestPermission,
    writable: true,
  })
  
  return mockNotification
}
