import { NextRequest, NextResponse } from 'next/server';
import {
  getStoreConnections,
  saveStoreConnection,
  updateStoreConnection,
  deleteStoreConnection,
} from '@/lib/db';
import { sanitizeShopifyDomain } from '@/lib/integrations/shopify';
import { sanitizeWooCommerceUrl } from '@/lib/integrations/woocommerce';

/**
 * Mask sensitive credentials for secure frontend display.
 */
function maskSecret(secret?: string | null): string | null {
  if (!secret) return null;
  if (secret.length <= 8) return '••••••••';
  const prefix = secret.slice(0, 5);
  const suffix = secret.slice(-4);
  return `${prefix}••••${suffix}`;
}

/**
 * GET /api/integrations
 * List all multi-channel store connections with masked credentials.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || undefined;

    const connections = await getStoreConnections(userId);

    const safeConnections = connections.map((conn) => ({
      id: conn.id,
      userId: conn.userId,
      platform: conn.platform,
      storeUrl: conn.storeUrl,
      isActive: conn.isActive,
      lastSyncAt: conn.lastSyncAt,
      createdAt: conn.createdAt,
      updatedAt: conn.updatedAt,
      hasAccessToken: Boolean(conn.accessToken),
      hasConsumerKey: Boolean(conn.consumerKey),
      hasConsumerSecret: Boolean(conn.consumerSecret),
      hasWebhookSecret: Boolean(conn.webhookSecret),
      maskedAccessToken: maskSecret(conn.accessToken),
      maskedConsumerKey: maskSecret(conn.consumerKey),
      maskedConsumerSecret: maskSecret(conn.consumerSecret),
    }));

    return NextResponse.json({
      success: true,
      connections: safeConnections,
    });
  } catch (error: any) {
    console.error('Error fetching store connections:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to retrieve store connections.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/integrations
 * Connect a new Shopify or WooCommerce store or update existing credentials.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      platform,
      storeUrl,
      accessToken,
      consumerKey,
      consumerSecret,
      webhookSecret,
      isActive = true,
      userId,
    } = body;

    // Validate platform
    if (!platform || !['Shopify', 'WooCommerce'].includes(platform)) {
      return NextResponse.json(
        { success: false, error: 'Platform must be either "Shopify" or "WooCommerce".' },
        { status: 400 }
      );
    }

    if (!storeUrl || typeof storeUrl !== 'string' || !storeUrl.trim()) {
      return NextResponse.json(
        { success: false, error: 'Store URL / Domain is required.' },
        { status: 400 }
      );
    }

    // Platform-specific validation and sanitization
    let cleanUrl = storeUrl.trim();
    if (platform === 'Shopify') {
      cleanUrl = sanitizeShopifyDomain(cleanUrl);
      if (!accessToken || typeof accessToken !== 'string' || !accessToken.trim()) {
        return NextResponse.json(
          {
            success: false,
            error: 'Shopify Admin API Access Token (shpat_...) is required to connect.',
          },
          { status: 400 }
        );
      }
    } else if (platform === 'WooCommerce') {
      cleanUrl = sanitizeWooCommerceUrl(cleanUrl);
      if (!consumerKey || !consumerSecret) {
        return NextResponse.json(
          {
            success: false,
            error: 'Both Consumer Key (ck_...) and Consumer Secret (cs_...) are required for WooCommerce.',
          },
          { status: 400 }
        );
      }
    }

    const savedConnection = await saveStoreConnection({
      userId,
      platform,
      storeUrl: cleanUrl,
      accessToken: accessToken?.trim() || null,
      consumerKey: consumerKey?.trim() || null,
      consumerSecret: consumerSecret?.trim() || null,
      webhookSecret: webhookSecret?.trim() || null,
      isActive,
    });

    return NextResponse.json(
      {
        success: true,
        message: `${platform} store connection saved successfully.`,
        connection: {
          id: savedConnection.id,
          platform: savedConnection.platform,
          storeUrl: savedConnection.storeUrl,
          isActive: savedConnection.isActive,
          lastSyncAt: savedConnection.lastSyncAt,
          maskedAccessToken: maskSecret(savedConnection.accessToken),
          maskedConsumerKey: maskSecret(savedConnection.consumerKey),
          maskedConsumerSecret: maskSecret(savedConnection.consumerSecret),
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error saving store connection:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to save store connection.' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/integrations
 * Update store connection status (e.g., toggle isActive) or modify settings.
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, isActive, storeUrl, accessToken, consumerKey, consumerSecret } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Connection ID is required.' },
        { status: 400 }
      );
    }

    const updated = await updateStoreConnection(id, {
      ...(typeof isActive === 'boolean' ? { isActive } : {}),
      ...(storeUrl ? { storeUrl } : {}),
      ...(accessToken ? { accessToken } : {}),
      ...(consumerKey ? { consumerKey } : {}),
      ...(consumerSecret ? { consumerSecret } : {}),
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Store connection not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Store connection updated successfully.',
      connection: {
        id: updated.id,
        platform: updated.platform,
        storeUrl: updated.storeUrl,
        isActive: updated.isActive,
        lastSyncAt: updated.lastSyncAt,
      },
    });
  } catch (error: any) {
    console.error('Error updating store connection:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update store connection.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/integrations
 * Disconnect and remove a store integration.
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');

    if (!id) {
      try {
        const body = await request.json();
        id = body.id;
      } catch (e) {
        // Body was empty or not json
      }
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Store connection ID is required for deletion.' },
        { status: 400 }
      );
    }

    const deleted = await deleteStoreConnection(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Store connection not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${deleted.platform} store (${deleted.storeUrl}) disconnected successfully.`,
    });
  } catch (error: any) {
    console.error('Error deleting store connection:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to disconnect store.' },
      { status: 500 }
    );
  }
}
