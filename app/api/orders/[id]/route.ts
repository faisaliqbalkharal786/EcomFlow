import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, updateOrder } from '@/lib/db';

interface RouteContext {
  params: {
    id: string;
  };
}

/**
 * GET /api/orders/[id]
 * Fetch single order details and telephony call logs.
 */
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = params;
    const order = await getOrderById(id);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not Found',
          message: `Order with ID "${id}" does not exist.`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        order,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching order by ID:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        message: error?.message || 'Failed to retrieve order.',
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/orders/[id]
 * Updates order properties, specifically status and aiVerification ('Verified', 'Fake', 'Calling', 'Pending').
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = params;
    const body = await request.json();

    const existingOrder = await getOrderById(id);
    if (!existingOrder) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not Found',
          message: `Order with ID "${id}" does not exist.`,
        },
        { status: 404 }
      );
    }

    const { status, aiVerification, carrier, trackingNumber, labelGenerated } = body;

    // Validate aiVerification if provided
    const validAiStatuses = ['Verified', 'Fake', 'Fake/Cancelled', 'Calling', 'Calling...', 'Pending'];
    if (aiVerification && !validAiStatuses.includes(aiVerification)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation Error',
          message: `Invalid aiVerification status "${aiVerification}". Allowed values: ${validAiStatuses.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Normalized status
    const normalizedAiStatus =
      aiVerification === 'Fake' ? 'Fake' : aiVerification;

    const updated = await updateOrder(id, {
      ...(status && { status }),
      ...(aiVerification && { aiVerification: normalizedAiStatus }),
      ...(carrier && { carrier }),
      ...(trackingNumber && { trackingNumber }),
      ...(labelGenerated !== undefined && { labelGenerated }),
    });

    return NextResponse.json(
      {
        success: true,
        message: `Order ${existingOrder.orderNumber} updated successfully.`,
        order: updated,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        message: error?.message || 'Failed to update order.',
      },
      { status: 500 }
    );
  }
}
