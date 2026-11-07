import { NextRequest, NextResponse } from 'next/server';
import {
  mapShopifyOrderToEcomFlow,
  verifyShopifyHmac,
} from '@/lib/integrations/shopify';
import { upsertOrderFromIntegration, getStoreConnectionByPlatform } from '@/lib/db';
import { initiateOutboundAICall } from '@/lib/telephony';

export async function POST(request: NextRequest) {
  try {
    // 1. Read raw body as text for HMAC verification
    const rawBody = await request.text();
    const hmacHeader = request.headers.get('x-shopify-hmac-sha256');
    const shopDomain = request.headers.get('x-shopify-shop-domain') || '';
    const topic = request.headers.get('x-shopify-topic') || 'orders/create';

    // 2. Lookup store connection to retrieve configured webhook secret
    const connection = await getStoreConnectionByPlatform('Shopify', shopDomain);
    const webhookSecret =
      connection?.webhookSecret ||
      process.env.SHOPIFY_WEBHOOK_SECRET ||
      'shopify_webhook_secret_ecomflow';

    // 3. Security validation: Verify HMAC signature
    const isSignatureValid = verifyShopifyHmac(rawBody, hmacHeader, webhookSecret);

    // In production, reject unverified requests with HTTP 401 Unauthorized
    if (!isSignatureValid && process.env.NODE_ENV === 'production' && hmacHeader) {
      console.warn(`Shopify webhook HMAC verification failed for domain: ${shopDomain}`);
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid Shopify HMAC signature.' },
        { status: 401 }
      );
    }

    // 4. Parse JSON payload
    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch (parseError) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON payload received.' },
        { status: 400 }
      );
    }

    // 5. Transform Shopify payload to EcomFlow Order schema
    const mappedOrder = mapShopifyOrderToEcomFlow(payload);

    // Ensure status starts as Pending and aiVerification starts as Pending
    mappedOrder.status = 'Pending';
    mappedOrder.aiVerification = 'Pending';

    // 6. Save order into database
    const savedOrder = await upsertOrderFromIntegration(mappedOrder);

    // 7. Auto-Call Dispatch Trigger (if AI auto-calling enabled)
    const isAutoCallEnabled = process.env.AI_AUTO_CALL_ENABLED === 'true';
    let callDispatchResult = null;

    if (isAutoCallEnabled && savedOrder.phone) {
      try {
        callDispatchResult = await initiateOutboundAICall({
          orderId: savedOrder.id,
          orderNumber: savedOrder.orderNumber,
          customerName: savedOrder.customerName,
          phone: savedOrder.phone,
          orderAmount: savedOrder.amount,
          shippingAddress: savedOrder.shippingAddress || '',
          workspaceName: 'Apex Global Brands',
        });
      } catch (callError) {
        console.warn('AI Voice Agent auto-dispatch queued or deferred:', callError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Shopify order ${savedOrder.orderNumber} ingested successfully.`,
        order: {
          id: savedOrder.id,
          orderNumber: savedOrder.orderNumber,
          channel: savedOrder.channel,
          amount: savedOrder.amount,
          status: savedOrder.status,
          aiVerification: savedOrder.aiVerification,
        },
        topic,
        autoCallTriggered: Boolean(callDispatchResult?.success),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error processing Shopify webhook:', error);
    // Return 200 to prevent Shopify from endlessly retrying if it's an internal logging error
    return NextResponse.json(
      { success: false, error: error?.message || 'Error processing webhook.' },
      { status: 500 }
    );
  }
}
