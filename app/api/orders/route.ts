import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders, createOrder } from '@/lib/db';

/**
 * GET /api/orders
 * Returns list of multi-channel orders with optional filtering by channel or aiVerification status.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const channel = searchParams.get('channel');
    const aiVerification = searchParams.get('aiVerification');
    const status = searchParams.get('status');

    let orders: any[] = await getAllOrders();

    if (channel && channel !== 'All') {
      orders = orders.filter((o) => o.channel.toLowerCase() === channel.toLowerCase());
    }

    if (aiVerification && aiVerification !== 'All') {
      orders = orders.filter((o) => o.aiVerification.toLowerCase() === aiVerification.toLowerCase());
    }

    if (status && status !== 'All') {
      orders = orders.filter((o) => o.status.toLowerCase() === status.toLowerCase());
    }

    return NextResponse.json(
      {
        success: true,
        count: orders.length,
        orders,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch orders from database.',
        message: error?.message || 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/orders
 * Ingests a new order (simulates an inbound webhook from Shopify, Amazon FBM, or WooCommerce).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      channel,
      customerName,
      phone,
      amount,
      customerEmail,
      shippingAddress,
      city,
      state,
      carrier,
      channelOrderId,
    } = body;

    // Basic Validation
    if (!channel || !customerName || !phone || amount === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation Error',
          message: 'Missing required fields: channel, customerName, phone, and amount are required.',
        },
        { status: 400 }
      );
    }

    // Default aiVerification to 'Pending' (or 'Calling...' if auto-call is active)
    const newOrder = await createOrder({
      channel,
      channelOrderId: channelOrderId || `EXT-${Date.now().toString().slice(-6)}`,
      customerName,
      customerEmail: customerEmail || `${customerName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone,
      amount: Number(amount),
      shippingAddress: shippingAddress || '100 Main St',
      city: city || 'Austin',
      state: state || 'TX',
      carrier: carrier || 'USPS Priority Mail',
      status: 'Pending',
      aiVerification: 'Pending',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Order created successfully from sales channel webhook.',
        order: newOrder,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create order in database.',
        message: error?.message || 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
