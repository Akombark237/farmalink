// API Documentation endpoint - Interactive API explorer
import { NextResponse } from 'next/server';

export async function GET() {
  const apiDocumentation = {
    title: "PharmaLink API Documentation",
    version: "1.0.0",
    description: "Complete API documentation for PharmaLink - Cameroon's leading pharmacy platform",
    baseUrl: process.env.NEXTAUTH_URL || "http://localhost:3001",
    endpoints: {
      authentication: {
        login: {
          method: "POST",
          path: "/api/auth/login",
          description: "Authenticate user and receive JWT token",
          body: {
            email: "string (required)",
            password: "string (required, min 6 chars)"
          },
          response: {
            success: "boolean",
            message: "string",
            data: {
              user: "object",
              token: "string",
              expiresIn: "string"
            }
          },
          example: {
            request: {
              email: "patient@pharmalink.com",
              password: "password123"
            }
          }
        },
        register: {
          method: "POST",
          path: "/api/auth/register",
          description: "Register new user account",
          body: {
            email: "string (required)",
            password: "string (required, min 6 chars)",
            firstName: "string (required)",
            lastName: "string (required)",
            userType: "string (patient|pharmacy)",
            phone: "string (optional)"
          }
        },
        verify: {
          method: "GET",
          path: "/api/auth/verify",
          description: "Verify JWT token and get user info",
          headers: {
            Authorization: "Bearer <token>"
          }
        },
        logout: {
          method: "POST",
          path: "/api/auth/logout",
          description: "Logout and clear session"
        }
      },
      pharmacies: {
        list: {
          method: "GET",
          path: "/api/pharmacies",
          description: "Get list of pharmacies in Yaoundé",
          query: {
            search: "string (optional)",
            limit: "number (default: 20)",
            offset: "number (default: 0)",
            includeInventory: "boolean (default: false)"
          },
          response: {
            success: "boolean",
            data: "array of pharmacy objects",
            pagination: "object"
          }
        }
      },
      medications: {
        list: {
          method: "GET",
          path: "/api/medications",
          description: "Get list of available medications",
          query: {
            search: "string (optional)",
            category: "string (optional)",
            limit: "number (default: 50)",
            offset: "number (default: 0)",
            includePharmacies: "boolean (default: false)"
          }
        }
      },
      search: {
        universal: {
          method: "GET",
          path: "/api/search",
          description: "Universal search for drugs and pharmacies",
          query: {
            query: "string (required)",
            type: "string (drugs|pharmacies, default: drugs)",
            limit: "number (default: 20)",
            offset: "number (default: 0)"
          }
        }
      },
      orders: {
        list: {
          method: "GET",
          path: "/api/orders",
          description: "Get user's order history",
          headers: {
            Authorization: "Bearer <token>"
          },
          query: {
            status: "string (optional)",
            limit: "number (default: 20)",
            offset: "number (default: 0)"
          }
        },
        create: {
          method: "POST",
          path: "/api/orders",
          description: "Create new order",
          headers: {
            Authorization: "Bearer <token>"
          },
          body: {
            pharmacyId: "string (required)",
            items: "array (required)",
            deliveryAddress: "string (required)",
            deliveryMethod: "string (pickup|delivery)"
          }
        },
        details: {
          method: "GET",
          path: "/api/orders/[id]",
          description: "Get specific order details",
          headers: {
            Authorization: "Bearer <token>"
          }
        }
      },
      vendor: {
        dashboard: {
          method: "GET",
          path: "/api/vendor/dashboard",
          description: "Get pharmacy vendor dashboard data",
          headers: {
            Authorization: "Bearer <pharmacy_token>"
          },
          query: {
            days: "number (default: 30)"
          }
        },
        inventory: {
          method: "GET",
          path: "/api/vendor/inventory",
          description: "Get pharmacy inventory",
          headers: {
            Authorization: "Bearer <pharmacy_token>"
          }
        }
      },
      system: {
        health: {
          method: "GET",
          path: "/api/health",
          description: "System health check",
          response: {
            status: "string (healthy|degraded|unhealthy)",
            timestamp: "string",
            services: "object",
            endpoints: "object"
          }
        }
      }
    },
    examples: {
      authentication: {
        loginRequest: `curl -X POST ${process.env.NEXTAUTH_URL || "http://localhost:3001"}/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"patient@pharmalink.com","password":"password123"}'`,
        
        protectedRequest: `curl -X GET ${process.env.NEXTAUTH_URL || "http://localhost:3001"}/api/orders \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`
      },
      search: {
        drugSearch: `curl "${process.env.NEXTAUTH_URL || "http://localhost:3001"}/api/search?query=paracetamol&type=drugs"`,
        pharmacySearch: `curl "${process.env.NEXTAUTH_URL || "http://localhost:3001"}/api/search?query=pharmacie&type=pharmacies"`
      }
    },
    errorCodes: {
      400: "Bad Request - Invalid input data",
      401: "Unauthorized - Authentication required",
      403: "Forbidden - Insufficient permissions",
      404: "Not Found - Resource not found",
      409: "Conflict - Resource already exists",
      429: "Too Many Requests - Rate limit exceeded",
      500: "Internal Server Error - Server error"
    },
    dataModels: {
      user: {
        id: "string",
        email: "string",
        userType: "string",
        emailVerified: "boolean",
        profile: "object"
      },
      pharmacy: {
        id: "string",
        name: "string",
        address: "string",
        phone: "string",
        rating: "number",
        location: {
          lat: "number",
          lng: "number"
        },
        medications: "array"
      },
      medication: {
        id: "string",
        name: "string",
        category: "string",
        price: "number",
        inStock: "boolean",
        pharmacies: "array"
      },
      order: {
        id: "string",
        orderNumber: "string",
        status: "string",
        totalAmount: "number",
        currency: "string",
        items: "array",
        pharmacy: "object"
      }
    }
  };

  // Return HTML documentation page
  const htmlDoc = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PharmaLink API Documentation</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
        h2 { color: #1e40af; margin-top: 30px; }
        h3 { color: #1d4ed8; }
        .endpoint { background: #f8fafc; padding: 15px; border-radius: 6px; margin: 10px 0; border-left: 4px solid #2563eb; }
        .method { display: inline-block; padding: 4px 8px; border-radius: 4px; color: white; font-weight: bold; margin-right: 10px; }
        .get { background: #10b981; }
        .post { background: #f59e0b; }
        .put { background: #8b5cf6; }
        .delete { background: #ef4444; }
        code { background: #e5e7eb; padding: 2px 6px; border-radius: 4px; font-family: 'Monaco', 'Consolas', monospace; }
        pre { background: #1f2937; color: #f9fafb; padding: 15px; border-radius: 6px; overflow-x: auto; }
        .json { background: #ecfdf5; border: 1px solid #d1fae5; padding: 10px; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🏥 PharmaLink API Documentation</h1>
        <p><strong>Version:</strong> ${apiDocumentation.version}</p>
        <p><strong>Base URL:</strong> <code>${apiDocumentation.baseUrl}</code></p>
        <p>${apiDocumentation.description}</p>
        
        <h2>🔐 Authentication</h2>
        <p>PharmaLink uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:</p>
        <pre>Authorization: Bearer YOUR_JWT_TOKEN</pre>
        
        <h2>📋 API Endpoints</h2>
        
        <h3>Authentication</h3>
        <div class="endpoint">
            <span class="method post">POST</span><code>/api/auth/login</code>
            <p>Authenticate user and receive JWT token</p>
        </div>
        
        <div class="endpoint">
            <span class="method post">POST</span><code>/api/auth/register</code>
            <p>Register new user account</p>
        </div>
        
        <h3>Pharmacies</h3>
        <div class="endpoint">
            <span class="method get">GET</span><code>/api/pharmacies</code>
            <p>Get list of pharmacies in Yaoundé with optional search and pagination</p>
        </div>
        
        <h3>Medications</h3>
        <div class="endpoint">
            <span class="method get">GET</span><code>/api/medications</code>
            <p>Get list of available medications with category filtering</p>
        </div>
        
        <h3>Search</h3>
        <div class="endpoint">
            <span class="method get">GET</span><code>/api/search</code>
            <p>Universal search for drugs and pharmacies</p>
        </div>
        
        <h3>Orders (Protected)</h3>
        <div class="endpoint">
            <span class="method get">GET</span><code>/api/orders</code>
            <p>Get user's order history</p>
        </div>
        
        <div class="endpoint">
            <span class="method post">POST</span><code>/api/orders</code>
            <p>Create new order</p>
        </div>
        
        <h3>Vendor Dashboard (Protected)</h3>
        <div class="endpoint">
            <span class="method get">GET</span><code>/api/vendor/dashboard</code>
            <p>Get pharmacy vendor analytics and dashboard data</p>
        </div>
        
        <h2>🧪 Testing Examples</h2>
        
        <h3>Login Example</h3>
        <pre>${apiDocumentation.examples.authentication.loginRequest}</pre>
        
        <h3>Search Example</h3>
        <pre>${apiDocumentation.examples.search.drugSearch}</pre>
        
        <h2>📊 System Health</h2>
        <p>Check system status: <a href="/api/health" target="_blank">/api/health</a></p>
        
        <h2>🔗 Quick Links</h2>
        <ul>
            <li><a href="/api/health">Health Check</a></li>
            <li><a href="/api/pharmacies">Pharmacies List</a></li>
            <li><a href="/api/medications">Medications List</a></li>
            <li><a href="/api/search?query=paracetamol">Search Example</a></li>
        </ul>
        
        <div class="json">
            <h3>📄 Full API Specification (JSON)</h3>
            <p><a href="/api/docs?format=json">Download JSON specification</a></p>
        </div>
    </div>
</body>
</html>`;

  // Return JSON if requested, otherwise return HTML
  const format = new URL(request.url).searchParams.get('format');
  
  if (format === 'json') {
    return NextResponse.json(apiDocumentation);
  }
  
  return new NextResponse(htmlDoc, {
    headers: { 'Content-Type': 'text/html' }
  });
}
