const request = require('supertest')
const express = require('express')

// Mock dependencies
jest.mock('@google/generative-ai')
jest.mock('@pinecone-database/pinecone')
jest.mock('@supabase/supabase-js')

const { GoogleGenerativeAI } = require('@google/generative-ai')
const { Pinecone } = require('@pinecone-database/pinecone')
const { createClient } = require('@supabase/supabase-js')

describe('Gemini Proxy Server', () => {
  let app
  let mockGenAI
  let mockPinecone
  let mockSupabase

  beforeAll(() => {
    // Setup mocks
    mockGenAI = {
      getGenerativeModel: jest.fn().mockReturnValue({
        generateContent: jest.fn(),
      }),
    }
    GoogleGenerativeAI.mockImplementation(() => mockGenAI)

    mockPinecone = {
      index: jest.fn().mockReturnValue({
        query: jest.fn(),
        upsert: jest.fn(),
      }),
    }
    Pinecone.mockImplementation(() => mockPinecone)

    mockSupabase = {
      from: jest.fn().mockReturnValue({
        insert: jest.fn().mockReturnValue({ data: null, error: null }),
        select: jest.fn().mockReturnValue({ data: [], error: null }),
      }),
    }
    createClient.mockReturnValue(mockSupabase)

    // Import app after mocks are set up
    app = require('../server')
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200)

      expect(response.body).toEqual({
        status: 'healthy',
        timestamp: expect.any(String),
        service: 'gemini-medical-chatbot-api',
      })
    })
  })

  describe('Medical Chat API', () => {
    it('should handle medical questions', async () => {
      const mockResponse = {
        response: {
          text: () => 'Paracetamol is a common pain reliever and fever reducer.',
        },
      }
      mockGenAI.getGenerativeModel().generateContent.mockResolvedValue(mockResponse)

      const response = await request(app)
        .post('/api/medical-chat')
        .send({
          message: 'What is paracetamol used for?',
          context: 'general',
        })
        .expect(200)

      expect(response.body).toEqual({
        success: true,
        response: 'Paracetamol is a common pain reliever and fever reducer.',
        context: 'general',
      })

      expect(mockGenAI.getGenerativeModel().generateContent).toHaveBeenCalledWith(
        expect.stringContaining('What is paracetamol used for?')
      )
    })

    it('should handle medication-specific questions', async () => {
      const mockResponse = {
        response: {
          text: () => 'The typical dosage for adults is 500-1000mg every 4-6 hours.',
        },
      }
      mockGenAI.getGenerativeModel().generateContent.mockResolvedValue(mockResponse)

      const response = await request(app)
        .post('/api/medical-chat')
        .send({
          message: 'What is the dosage for paracetamol?',
          context: 'medication',
          medicationId: '1',
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.response).toContain('dosage')
    })

    it('should handle pharmacy-specific questions', async () => {
      const mockResponse = {
        response: {
          text: () => 'Yes, this medication is currently available at our pharmacy.',
        },
      }
      mockGenAI.getGenerativeModel().generateContent.mockResolvedValue(mockResponse)

      const response = await request(app)
        .post('/api/medical-chat')
        .send({
          message: 'Is paracetamol available?',
          context: 'pharmacy',
          pharmacyId: '1',
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.response).toContain('available')
    })

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/medical-chat')
        .send({})
        .expect(400)

      expect(response.body).toEqual({
        success: false,
        error: 'Message is required',
      })
    })

    it('should handle API errors gracefully', async () => {
      mockGenAI.getGenerativeModel().generateContent.mockRejectedValue(
        new Error('API quota exceeded')
      )

      const response = await request(app)
        .post('/api/medical-chat')
        .send({
          message: 'What is paracetamol?',
          context: 'general',
        })
        .expect(500)

      expect(response.body).toEqual({
        success: false,
        error: 'Failed to generate response',
      })
    })

    it('should filter inappropriate content', async () => {
      const response = await request(app)
        .post('/api/medical-chat')
        .send({
          message: 'How to make illegal drugs?',
          context: 'general',
        })
        .expect(400)

      expect(response.body).toEqual({
        success: false,
        error: 'Inappropriate content detected',
      })
    })

    it('should rate limit requests', async () => {
      // Make multiple requests quickly
      const promises = Array(10).fill().map(() =>
        request(app)
          .post('/api/medical-chat')
          .send({
            message: 'What is paracetamol?',
            context: 'general',
          })
      )

      const responses = await Promise.all(promises)
      const rateLimitedResponses = responses.filter(r => r.status === 429)
      
      expect(rateLimitedResponses.length).toBeGreaterThan(0)
    })
  })

  describe('Medical Embeddings API', () => {
    it('should search medical content', async () => {
      const mockQueryResponse = {
        matches: [
          {
            id: 'med_1',
            score: 0.95,
            metadata: {
              name: 'Paracetamol',
              description: 'Pain reliever',
              category: 'Pain Relief',
            },
          },
        ],
      }
      mockPinecone.index().query.mockResolvedValue(mockQueryResponse)

      const response = await request(app)
        .post('/api/search-medical')
        .send({
          query: 'pain relief medication',
          topK: 5,
        })
        .expect(200)

      expect(response.body).toEqual({
        success: true,
        results: mockQueryResponse.matches,
      })
    })

    it('should handle empty search results', async () => {
      mockPinecone.index().query.mockResolvedValue({ matches: [] })

      const response = await request(app)
        .post('/api/search-medical')
        .send({
          query: 'nonexistent medication',
          topK: 5,
        })
        .expect(200)

      expect(response.body).toEqual({
        success: true,
        results: [],
      })
    })

    it('should validate search parameters', async () => {
      const response = await request(app)
        .post('/api/search-medical')
        .send({})
        .expect(400)

      expect(response.body).toEqual({
        success: false,
        error: 'Query is required',
      })
    })
  })

  describe('Chat History API', () => {
    it('should save chat messages', async () => {
      mockSupabase.from().insert.mockReturnValue({
        data: { id: 1 },
        error: null,
      })

      const response = await request(app)
        .post('/api/chat-history')
        .send({
          userId: 'user_123',
          message: 'What is paracetamol?',
          response: 'Paracetamol is a pain reliever.',
          context: 'general',
        })
        .expect(200)

      expect(response.body).toEqual({
        success: true,
        messageId: 1,
      })

      expect(mockSupabase.from).toHaveBeenCalledWith('chat_messages')
    })

    it('should retrieve chat history', async () => {
      const mockHistory = [
        {
          id: 1,
          message: 'What is paracetamol?',
          response: 'Paracetamol is a pain reliever.',
          timestamp: '2024-01-01T00:00:00Z',
        },
      ]
      mockSupabase.from().select.mockReturnValue({
        data: mockHistory,
        error: null,
      })

      const response = await request(app)
        .get('/api/chat-history/user_123')
        .expect(200)

      expect(response.body).toEqual({
        success: true,
        history: mockHistory,
      })
    })

    it('should handle database errors', async () => {
      mockSupabase.from().insert.mockReturnValue({
        data: null,
        error: { message: 'Database connection failed' },
      })

      const response = await request(app)
        .post('/api/chat-history')
        .send({
          userId: 'user_123',
          message: 'Test message',
          response: 'Test response',
        })
        .expect(500)

      expect(response.body).toEqual({
        success: false,
        error: 'Failed to save chat message',
      })
    })
  })

  describe('CORS and Security', () => {
    it('should handle CORS preflight requests', async () => {
      const response = await request(app)
        .options('/api/medical-chat')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'POST')
        .expect(200)

      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000')
      expect(response.headers['access-control-allow-methods']).toContain('POST')
    })

    it('should reject requests from unauthorized origins', async () => {
      const response = await request(app)
        .post('/api/medical-chat')
        .set('Origin', 'http://malicious-site.com')
        .send({
          message: 'Test message',
          context: 'general',
        })
        .expect(403)

      expect(response.body).toEqual({
        success: false,
        error: 'Unauthorized origin',
      })
    })

    it('should validate API key for protected endpoints', async () => {
      const response = await request(app)
        .post('/api/admin/update-embeddings')
        .send({
          medications: [],
        })
        .expect(401)

      expect(response.body).toEqual({
        success: false,
        error: 'API key required',
      })
    })
  })

  describe('Performance and Monitoring', () => {
    it('should track response times', async () => {
      const startTime = Date.now()
      
      await request(app)
        .get('/health')
        .expect(200)
      
      const endTime = Date.now()
      const responseTime = endTime - startTime
      
      expect(responseTime).toBeLessThan(1000) // Should respond within 1 second
    })

    it('should handle concurrent requests', async () => {
      const mockResponse = {
        response: {
          text: () => 'Test response',
        },
      }
      mockGenAI.getGenerativeModel().generateContent.mockResolvedValue(mockResponse)

      const promises = Array(5).fill().map(() =>
        request(app)
          .post('/api/medical-chat')
          .send({
            message: 'Test message',
            context: 'general',
          })
      )

      const responses = await Promise.all(promises)
      
      responses.forEach(response => {
        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
      })
    })
  })
})
