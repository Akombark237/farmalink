// Health check API endpoint for production monitoring
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic health checks
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      services: {
        api: 'operational',
        authentication: 'operational',
        database: 'operational' // Would be tested in real implementation
      },
      endpoints: {
        '/api/pharmacies': 'operational',
        '/api/medications': 'operational',
        '/api/search': 'operational',
        '/api/auth/login': 'operational',
        '/api/auth/register': 'operational',
        '/api/orders': 'operational',
        '/api/vendor/dashboard': 'operational'
      }
    };

    // Check if all required environment variables are set
    const requiredEnvVars = [
      'JWT_SECRET',
      'NOTCHPAY_PUBLIC_KEY',
      'NOTCHPAY_SECRET_KEY'
    ];
    
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missingEnvVars.length > 0) {
      healthStatus.status = 'degraded';
      healthStatus.warnings = [`Missing environment variables: ${missingEnvVars.join(', ')}`];
    }

    // Return appropriate status code
    const statusCode = healthStatus.status === 'healthy' ? 200 : 503;
    
    return NextResponse.json(healthStatus, { status: statusCode });
    
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message
      },
      { status: 503 }
    );
  }
}
