import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, updateOrder } from '@/lib/db';

/**
 * POST /api/shipping/generate
 * Generates an authorized shipping label & tracking number for an order.
 * Strictly gated by AI Voice Verification: Returns HTTP 403 Forbidden if order is 'Fake' or not 'Verified'.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, carrier = 'USPS Priority Mail', packageType, weight } = body;

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Bad Request',
          message: 'Missing required field: "orderId" is required.',
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
          message: `Order with ID "${orderId}" was not found.`,
        },
        { status: 404 }
      );
    }

    // STRICT FRAUD & VERIFICATION GATING:
    // Check if aiVerification is "Verified"
    const aiStatus = (order.aiVerification || '').toLowerCase();

    if (aiStatus === 'fake' || aiStatus.includes('fake') || aiStatus.includes('cancelled')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden (Fraud Intercepted)',
          message: `Forbidden: Order ${order.orderNumber} is flagged as Fake/Fraudulent. Label generation has been permanently blocked by the AI Verification Security Shield.`,
          orderId: order.id,
          orderNumber: order.orderNumber,
          aiVerification: order.aiVerification,
        },
        { status: 403 }
      );
    }

    if (aiStatus !== 'verified') {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden (Verification Incomplete)',
          message: `Forbidden: Order ${order.orderNumber} has AI Verification status "${order.aiVerification}". Orders must complete voice confirmation before shipping labels can be dispatched.`,
          orderId: order.id,
          orderNumber: order.orderNumber,
          aiVerification: order.aiVerification,
        },
        { status: 403 }
      );
    }

    // If order is Verified, generate mock tracking number and label URL
    const isUps = carrier.toLowerCase().includes('ups');
    const isFedEx = carrier.toLowerCase().includes('fedex');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);

    const trackingNumber = isUps
      ? `1Z 999 999 03 ${randomSuffix} 4567`
      : isFedEx
      ? `7823 4410 ${randomSuffix}`
      : `9405 5082 ${randomSuffix} 3019 44`;

    const labelUrl = `https://labels.ecomflow.io/manifests/label-${order.orderNumber.replace('#', '')}.pdf`;

    // Update order in database
    const updatedOrder = await updateOrder(order.id, {
      labelGenerated: true,
      trackingNumber,
      labelUrl,
      carrier,
      status: order.status === 'Pending' ? 'Processing' : order.status,
    });

    return NextResponse.json(
      {
        success: true,
        message: `Shipping label generated successfully for verified order ${order.orderNumber}.`,
        trackingNumber,
        labelUrl,
        carrier,
        order: updatedOrder,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error generating shipping label:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        message: error?.message || 'Failed to generate shipping label.',
      },
      { status: 500 }
    );
  }
}
