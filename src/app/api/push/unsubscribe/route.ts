import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { endpoint } = await request.json();
    
    // Validate endpoint
    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint is required' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Find the subscription in your database by endpoint
    // 2. Remove it from the database
    // 3. Stop sending notifications to this endpoint

    console.log('Push unsubscription received for endpoint:', endpoint);

    // For now, we'll just log it and return success
    // TODO: Remove from database
    // await removeSubscription(endpoint);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Unsubscribed successfully' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing push unsubscription:', error);
    return NextResponse.json(
      { error: 'Failed to process unsubscription' },
      { status: 500 }
    );
  }
}
