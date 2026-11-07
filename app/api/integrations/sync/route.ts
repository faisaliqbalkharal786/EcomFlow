import { NextRequest, NextResponse } from 'next/server';
import { getStoreConnections, getStoreConnectionById } from '@/lib/db';
import { syncShopifyOrders } from '@/lib/integrations/shopify';
import { syncWooCommerceOrders } from '@/lib/integrations/woocommerce';

/**
 * POST /api/integrations/sync
 * Manually trigger order synchronization from connected stores.
 */
export async function POST(request: NextRequest) {
  try {
    let connectionId: string | undefined;
    let platform: string | undefined;

    try {
      const body = await request.json();
      connectionId = body.connectionId;
      platform = body.platform;
    } catch {
      // Body may be empty
    }

    const results = [];
    let totalSynced = 0;

    if (connectionId) {
      const conn = await getStoreConnectionById(connectionId);
      if (!conn) {
        return NextResponse.json(
          { success: false, error: 'Store connection not found.' },
          { status: 404 }
        );
      }

      if (!conn.isActive) {
        return NextResponse.json(
          { success: false, error: `Store ${conn.storeUrl} is inactive. Enable it to sync.` },
          { status: 400 }
        );
      }

      if (conn.platform === 'Shopify') {
        const res = await syncShopifyOrders(conn);
        results.push(res);
        totalSynced += res.syncedCount;
      } else if (conn.platform === 'WooCommerce') {
        const res = await syncWooCommerceOrders(conn);
        results.push(res);
        totalSynced += res.syncedCount;
      }
    } else {
      // Sync all active connections or filtered by platform
      const allConnections = await getStoreConnections();
      const activeConns = allConnections.filter(
        (c) => c.isActive && (!platform || c.platform.toLowerCase() === platform.toLowerCase())
      );

      if (activeConns.length === 0) {
        return NextResponse.json({
          success: true,
          message: 'No active store connections to sync.',
          totalSynced: 0,
          results: [],
        });
      }

      for (const conn of activeConns) {
        try {
          if (conn.platform === 'Shopify') {
            const res = await syncShopifyOrders(conn);
            results.push(res);
            totalSynced += res.syncedCount;
          } else if (conn.platform === 'WooCommerce') {
            const res = await syncWooCommerceOrders(conn);
            results.push(res);
            totalSynced += res.syncedCount;
          }
        } catch (err: any) {
          console.error(`Error syncing ${conn.platform} (${conn.storeUrl}):`, err);
          results.push({
            success: false,
            platform: conn.platform,
            storeUrl: conn.storeUrl,
            error: err?.message || 'Sync failed.',
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synchronized ${totalSynced} order(s) from connected channels.`,
      totalSynced,
      results,
    });
  } catch (error: any) {
    console.error('Error during store order synchronization:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Order synchronization failed.' },
      { status: 500 }
    );
  }
}
