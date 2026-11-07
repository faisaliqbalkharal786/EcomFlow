import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getOrderById, updateOrder, createCallLog, getWorkspaceInfo, getCustomVoicePrompt } from '@/lib/db';
import { initiateOutboundAICall } from '@/lib/telephony';

/**
 * POST /api/calls/initiate
 * Initiates an outbound automated AI phone call to a customer for order verification.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, language = 'ur' } = body;

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Bad Request',
          message: 'Missing required field: "orderId" is required to initiate a call.',
        },
        { status: 400 }
      );
    }

    // 1. Fetch Order from Prisma database
    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not Found',
          message: `Order with ID "${orderId}" was not found in the database.`,
        },
        { status: 404 }
      );
    }

    const customerPhone = order.phone || (order as any).customer?.phone;
    const customerName = order.customerName || (order as any).customer?.name || 'Valued Customer';
    const shippingAddress = order.shippingAddress || '402 Congress Ave, Austin, TX';
    const amount = order.amount !== undefined ? order.amount : (order as any).totalAmount || 0;

    if (!customerPhone) {
      return NextResponse.json(
        {
          success: false,
          error: 'Bad Request',
          message: `Order ${order.orderNumber} does not have a customer phone number on record.`,
        },
        { status: 400 }
      );
    }

    // 2. Fetch Workspace Name
    const workspaceName = await getWorkspaceInfo();

    // 3. Fetch caller's custom AI voice prompt (per-tenant scripting)
    //    Try to resolve user ID from session; fall back gracefully if not available
    let customVoicePrompt: string | null = null;
    try {
      const session = await getServerSession(authOptions);
      const userId = (session?.user as any)?.id;
      if (userId) {
        customVoicePrompt = await getCustomVoicePrompt(userId);
      }
    } catch {
      // Non-fatal: missing session just means we fall back to the default Urdu prompt
    }

    // 4. Initiate Twilio + Retell AI Outbound Call strictly in Urdu
    let callResult;
    try {
      callResult = await initiateOutboundAICall({
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerName,
        phone: customerPhone,
        orderAmount: amount,
        shippingAddress,
        workspaceName,
        customPrompt: customVoicePrompt,
        language: language || 'ur',
        llmModel: 'gpt-4o',
        voiceId: 'eleven_multilingual_v2',
      });
    } catch (telephonyError: any) {
      return NextResponse.json(
        {
          success: false,
          error: 'Telephony Dispatch Error',
          message: telephonyError?.message || 'Failed to connect call via telephony provider.',
        },
        { status: 400 }
      );
    }

    // 4. Update Order status in Prisma database to "Calling..."
    const updatedOrder = await updateOrder(order.id, {
      aiVerification: 'Calling...',
    });

    // 5. Create initial record in CallLog model
    await createCallLog({
      orderId: order.id,
      duration: 'Connecting...',
      status: 'Calling...',
      confidenceScore: 0,
      transcript: `Telephony session initialized (${callResult.callSid}) strictly in Urdu. Model: gpt-4o. Initial greeting: "Assalam-o-Alaikum, kya meri baat ${customerName} se ho rahi hai? Main ${workspaceName} se baat kar raha/rahi hoon."`,
      notes: `Outbound call initiated in Urdu to ${customerPhone} on behalf of ${workspaceName}.`,
    });

    return NextResponse.json(
      {
        success: true,
        message: `AI Voice Agent is dialing customer line for ${order.orderNumber} in Urdu.`,
        callSid: callResult.callSid,
        status: callResult.status,
        provider: callResult.provider,
        language: callResult.language || 'ur',
        model: callResult.model || 'gpt-4o',
        voice: callResult.voice || 'eleven_multilingual_v2',
        prompt: callResult.prompt,
        order: updatedOrder,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error initiating AI voice call:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        message: error?.message || 'Failed to initiate outbound AI call.',
      },
      { status: 500 }
    );
  }
}
