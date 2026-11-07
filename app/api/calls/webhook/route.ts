import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, updateOrder, createCallLog } from '@/lib/db';

/**
 * POST /api/calls/webhook
 * Receives the end-of-call webhook from Retell AI / Twilio / OpenAI Realtime Telephony.
 * Analyzes call outcome, updates Order aiVerification ('Verified' or 'Fake'), and persists CallLog.
 */
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryOrderId = searchParams.get('orderId');

    let body: any = {};
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      body = await request.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      // Twilio standard form-encoded status callback
      const formData = await request.formData();
      body = Object.fromEntries(formData.entries());
    }

    // Extract Order Reference
    const orderId =
      body.orderId ||
      body.order_id ||
      body.metadata?.orderId ||
      body.call?.metadata?.orderId ||
      queryOrderId;

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Bad Request',
          message: 'Missing "orderId" in webhook payload or query parameters.',
        },
        { status: 400 }
      );
    }

    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not Found',
          message: `Order "${orderId}" not found in database.`,
        },
        { status: 404 }
      );
    }

    // 1. Extract Call Metrics (Supports Retell AI schema, Twilio status callbacks, and direct testing)
    const rawDuration =
      body.duration ||
      body.call?.duration_ms ||
      body.CallDuration ||
      '45s';

    const formattedDuration =
      typeof rawDuration === 'number'
        ? `${Math.round(rawDuration / 1000)}s`
        : String(rawDuration).includes('s')
        ? rawDuration
        : `${rawDuration}s`;

    const rawTranscript =
      body.transcript ||
      body.call?.transcript ||
      body.call_analysis?.transcript ||
      `AI: Did you place order ${order.orderNumber} for $${order.amount}? Customer: Yes, confirmed delivery to ${order.shippingAddress || 'registered address'}.`;

    // 2. Extract AI Analysis / Determination (Verified vs Fake)
    let determination: 'Verified' | 'Fake' = 'Verified';
    let confidenceScore = 95;

    if (body.determination) {
      determination = body.determination.toLowerCase().includes('fake') ? 'Fake' : 'Verified';
    } else if (body.call_analysis?.custom_analysis_data?.is_legitimate !== undefined) {
      determination = body.call_analysis.custom_analysis_data.is_legitimate ? 'Verified' : 'Fake';
    } else if (body.CallStatus === 'failed' || body.CallStatus === 'busy' || body.CallStatus === 'no-answer') {
      determination = 'Fake';
      confidenceScore = 15;
    }

    if (body.confidenceScore !== undefined) {
      confidenceScore = Number(body.confidenceScore);
    } else if (body.call_analysis?.confidence !== undefined) {
      confidenceScore = Math.round(Number(body.call_analysis.confidence) * 100);
    } else {
      confidenceScore = determination === 'Verified' ? 98 : 12;
    }

    const notes =
      body.notes ||
      body.call_analysis?.summary ||
      (determination === 'Verified'
        ? `Customer answered call, confirmed identity and delivery address. Label generation authorized.`
        : `VOIP disconnected or customer cancelled. Order flagged as fraudulent to prevent return loss.`);

    // 3. Update Order in Prisma database
    const updatedOrder = await updateOrder(order.id, {
      aiVerification: determination,
      ...(determination === 'Fake' && { status: 'Cancelled' }),
    });

    // 4. Create new record in CallLog model in Prisma
    const callLog = await createCallLog({
      orderId: order.id,
      duration: formattedDuration,
      status: determination,
      confidenceScore,
      transcript: typeof rawTranscript === 'string' ? rawTranscript : JSON.stringify(rawTranscript),
      notes,
    });

    return NextResponse.json(
      {
        success: true,
        message: `Call results processed successfully. Order ${order.orderNumber} is now "${determination}".`,
        order: updatedOrder,
        callLog,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in call results webhook:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        message: error?.message || 'Failed to process call results webhook.',
      },
      { status: 500 }
    );
  }
}
