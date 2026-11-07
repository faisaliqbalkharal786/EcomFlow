import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

// Seeded users store with hashed credentials for instant testing
const defaultHashedPassword = bcrypt.hashSync('password123', 10);

let inMemoryUsers: any[] = [
  {
    id: 'usr_admin_1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@apexbrands.com',
    password: defaultHashedPassword,
    workspaceName: 'Apex Global Brands',
    customVoicePrompt: null as string | null,
    image: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'usr_admin_2',
    name: 'Demo Admin',
    email: 'admin@ecomflow.io',
    password: defaultHashedPassword,
    workspaceName: 'Apex Global Brands',
    customVoicePrompt: null as string | null,
    image: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// In-Memory fallback store seeded with realistic data for when PostgreSQL is not connected
let inMemoryOrders: any[] = [
  {
    id: 'ord_1',
    orderNumber: '#EF-98421',
    channel: 'Shopify',
    channelOrderId: 'SH-449102',
    customerName: 'Sophia Anderson',
    customerEmail: 'sophia.anderson@cloudmail.io',
    phone: '+1 (512) 555-0182',
    amount: 248.50,
    currency: 'USD',
    status: 'Pending',
    aiVerification: 'Verified',
    shippingAddress: '402 Congress Ave, Suite 800, Austin, TX 78701',
    city: 'Austin',
    state: 'TX',
    carrier: 'USPS Priority Mail',
    trackingNumber: null as string | null,
    labelUrl: null as string | null,
    labelGenerated: false,
    itemsCount: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    callLogs: [
      {
        id: 'cl_101',
        orderId: 'ord_1',
        duration: '42s',
        status: 'Verified',
        confidenceScore: 98,
        transcript: 'AI: Assalam-o-Alaikum, kya meri baat Sophia Anderson se ho rahi hai? Main Apex Global Brands se baat kar rahi hoon. Sophia: Walaikum Assalam! Ji bilkul, 402 Congress Ave address theek hai.',
        notes: 'Customer answered within 3 rings, confirmed address and order contents in Urdu.',
        createdAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'ord_2',
    orderNumber: '#EF-98420',
    channel: 'Amazon',
    channelOrderId: '114-8923401-22941',
    customerName: 'Marcus Vance',
    customerEmail: 'm.vance@techcorp.net',
    phone: '+1 (206) 555-0194',
    amount: 189.99,
    currency: 'USD',
    status: 'Shipped',
    aiVerification: 'Verified',
    shippingAddress: '1501 4th Ave, Seattle, WA 98101',
    city: 'Seattle',
    state: 'WA',
    carrier: 'UPS 2nd Day Air',
    trackingNumber: '1Z9999999999999999',
    labelUrl: 'https://labels.ecomflow.io/dl/1Z9999999999999999.pdf',
    labelGenerated: true,
    itemsCount: 1,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
    callLogs: [
      {
        id: 'cl_102',
        orderId: 'ord_2',
        duration: '35s',
        status: 'Verified',
        confidenceScore: 99,
        transcript: 'AI: Confirming Amazon order #114 for Marcus Vance. Marcus: Confirmed, please ship ASAP.',
        notes: 'Verified shipping zip code 98101 and authorized immediate dispatch.',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
  },
  {
    id: 'ord_3',
    orderNumber: '#EF-98419',
    channel: 'WooCommerce',
    channelOrderId: 'WC-88319',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@designlab.co',
    phone: '+1 (312) 555-0145',
    amount: 512.00,
    currency: 'USD',
    status: 'Processing',
    aiVerification: 'Calling...',
    shippingAddress: '233 S Wacker Dr, Floor 44, Chicago, IL 60606',
    city: 'Chicago',
    state: 'IL',
    carrier: 'FedEx Home Delivery',
    trackingNumber: null,
    labelUrl: null,
    labelGenerated: false,
    itemsCount: 4,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date().toISOString(),
    callLogs: [
      {
        id: 'cl_103',
        orderId: 'ord_3',
        duration: 'Calling...',
        status: 'Calling...',
        confidenceScore: null,
        transcript: 'AI dialed line +1 (312) 555-0145. Live call in progress.',
        notes: 'Telephony session currently open.',
        createdAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'ord_4',
    orderNumber: '#EF-98418',
    channel: 'Shopify',
    channelOrderId: 'SH-449098',
    customerName: 'Brandon Cole (Suspected Bot)',
    customerEmail: 'bcole99214@temp-mailbox.org',
    phone: '+1 (718) 555-0133',
    amount: 389.00,
    currency: 'USD',
    status: 'Cancelled',
    aiVerification: 'Fake',
    shippingAddress: '85 Adams St, Apt 12B, Brooklyn, NY 11201',
    city: 'Brooklyn',
    state: 'NY',
    carrier: 'USPS Priority Mail',
    trackingNumber: null,
    labelUrl: null,
    labelGenerated: false,
    itemsCount: 2,
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    updatedAt: new Date(Date.now() - 14000000).toISOString(),
    callLogs: [
      {
        id: 'cl_104',
        orderId: 'ord_4',
        duration: '18s',
        status: 'Fake',
        confidenceScore: 12,
        transcript: 'Carrier intercept: Dialed number is disconnected / VOIP burner line. Error 404.',
        notes: 'Flagged as high-risk fraudulent order. Order auto-cancelled to prevent RTO.',
        createdAt: new Date(Date.now() - 14400000).toISOString(),
      },
    ],
  },
  {
    id: 'ord_5',
    orderNumber: '#EF-98417',
    channel: 'eBay',
    channelOrderId: '22-09412-84192',
    customerName: 'Chloe Tremblay',
    customerEmail: 'chloe.t@vanguard.ca',
    phone: '+1 (305) 555-0199',
    amount: 329.00,
    currency: 'USD',
    status: 'Pending',
    aiVerification: 'Pending',
    shippingAddress: '1100 Brickell Bay Dr, Miami, FL 33131',
    city: 'Miami',
    state: 'FL',
    carrier: 'FedEx Ground',
    trackingNumber: null,
    labelUrl: null,
    labelGenerated: false,
    itemsCount: 1,
    createdAt: new Date(Date.now() - 21600000).toISOString(),
    updatedAt: new Date(Date.now() - 21600000).toISOString(),
    callLogs: [],
  },
];

export async function getAllOrders() {
  if (prisma) {
    try {
      const orders = await prisma.order.findMany({
        include: { callLogs: true },
        orderBy: { createdAt: 'desc' },
      });
      if (orders && orders.length > 0) return orders;
    } catch (e) {
      console.warn('Prisma query failed, falling back to in-memory store:', e);
    }
  }
  return inMemoryOrders;
}

export async function getOrderById(id: string) {
  if (prisma) {
    try {
      const order = await prisma.order.findUnique({
        where: { id },
        include: { callLogs: true },
      });
      if (order) return order;
    } catch (e) {
      console.warn('Prisma getOrderById failed, using fallback:', e);
    }
  }
  return inMemoryOrders.find((o) => o.id === id || o.orderNumber === id) || null;
}

export async function createOrder(data: {
  orderNumber?: string;
  channel: string;
  channelOrderId?: string;
  customerName: string;
  customerEmail?: string;
  phone: string;
  amount: number;
  currency?: string;
  status?: string;
  aiVerification?: string;
  shippingAddress?: string;
  city?: string;
  state?: string;
  carrier?: string;
}) {
  const newOrderNumber = data.orderNumber || `#EF-${Math.floor(10000 + Math.random() * 90000)}`;

  if (prisma) {
    try {
      return await prisma.order.create({
        data: {
          orderNumber: newOrderNumber,
          channel: data.channel,
          channelOrderId: data.channelOrderId || `CH-${Math.floor(100000 + Math.random() * 900000)}`,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          phone: data.phone,
          amount: data.amount,
          currency: data.currency || 'USD',
          status: data.status || 'Pending',
          aiVerification: data.aiVerification || 'Pending',
          shippingAddress: data.shippingAddress || 'Standard Delivery Address',
          city: data.city || 'Austin',
          state: data.state || 'TX',
          carrier: data.carrier || 'USPS Priority Mail',
        },
        include: { callLogs: true },
      });
    } catch (e) {
      console.warn('Prisma createOrder failed, saving to fallback:', e);
    }
  }

  const created = {
    id: `ord_${Date.now()}`,
    orderNumber: newOrderNumber,
    channel: data.channel,
    channelOrderId: data.channelOrderId || `CH-${Math.floor(100000 + Math.random() * 900000)}`,
    customerName: data.customerName,
    customerEmail: data.customerEmail || `${data.customerName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    phone: data.phone,
    amount: Number(data.amount),
    currency: data.currency || 'USD',
    status: data.status || 'Pending',
    aiVerification: data.aiVerification || 'Pending',
    shippingAddress: data.shippingAddress || '100 Congress Ave, Austin, TX 78701',
    city: data.city || 'Austin',
    state: data.state || 'TX',
    carrier: data.carrier || 'USPS Priority Mail',
    trackingNumber: null,
    labelUrl: null,
    labelGenerated: false,
    itemsCount: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    callLogs: [],
  };

  inMemoryOrders.unshift(created);
  return created;
}

export async function updateOrder(
  id: string,
  data: {
    status?: string;
    aiVerification?: string;
    trackingNumber?: string;
    labelUrl?: string;
    labelGenerated?: boolean;
    carrier?: string;
  }
) {
  if (prisma) {
    try {
      return await prisma.order.update({
        where: { id },
        data,
        include: { callLogs: true },
      });
    } catch (e) {
      console.warn('Prisma updateOrder failed, using fallback:', e);
    }
  }

  const index = inMemoryOrders.findIndex((o) => o.id === id || o.orderNumber === id);
  if (index === -1) return null;

  inMemoryOrders[index] = {
    ...inMemoryOrders[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  return inMemoryOrders[index];
}

export async function createCallLog(data: {
  orderId: string;
  duration: string;
  status: string;
  confidenceScore?: number;
  transcript: string;
  notes?: string;
}) {
  if (prisma) {
    try {
      return await prisma.callLog.create({
        data: {
          orderId: data.orderId,
          duration: data.duration,
          status: data.status,
          confidenceScore: data.confidenceScore,
          transcript: data.transcript,
          notes: data.notes,
        },
      });
    } catch (e) {
      console.warn('Prisma createCallLog failed, saving in memory:', e);
    }
  }

  const newLog = {
    id: `cl_${Date.now()}`,
    orderId: data.orderId,
    duration: data.duration,
    status: data.status,
    confidenceScore: data.confidenceScore || 95,
    transcript: data.transcript,
    notes: data.notes || '',
    createdAt: new Date().toISOString(),
  };

  const orderIndex = inMemoryOrders.findIndex((o) => o.id === data.orderId || o.orderNumber === data.orderId);
  if (orderIndex !== -1) {
    if (!inMemoryOrders[orderIndex].callLogs) {
      inMemoryOrders[orderIndex].callLogs = [];
    }
    inMemoryOrders[orderIndex].callLogs.unshift(newLog);
  }

  return newLog;
}

export async function getWorkspaceInfo() {
  if (prisma) {
    try {
      const user = await prisma.user.findFirst();
      if (user?.workspaceName) return user.workspaceName;
    } catch (e) {
      // fallback
    }
  }
  return 'Apex Global Brands';
}

export async function findUserByEmail(email: string) {
  const normalizedEmail = email.toLowerCase().trim();

  if (prisma) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });
      if (user) return user;
    } catch (e) {
      console.warn('Prisma findUserByEmail fallback:', e);
    }
  }

  return inMemoryUsers.find((u) => u.email.toLowerCase() === normalizedEmail) || null;
}

export async function findUserById(id: string) {
  if (prisma) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });
      if (user) return user;
    } catch (e) {
      console.warn('Prisma findUserById fallback:', e);
    }
  }

  return inMemoryUsers.find((u) => u.id === id) || null;
}

export async function createUser(data: {
  name: string;
  email: string;
  password?: string;
  workspaceName?: string;
}) {
  const normalizedEmail = data.email.toLowerCase().trim();

  if (prisma) {
    try {
      return await prisma.user.create({
        data: {
          name: data.name,
          email: normalizedEmail,
          password: data.password || null,
          workspaceName: data.workspaceName || 'Apex Global Brands',
        },
      });
    } catch (e) {
      console.warn('Prisma createUser fallback:', e);
    }
  }

  const newUser = {
    id: `usr_${Date.now()}`,
    name: data.name,
    email: normalizedEmail,
    password: data.password || null,
    workspaceName: data.workspaceName || 'Apex Global Brands',
    image: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  inMemoryUsers.push(newUser);
  return newUser;
}

// In-Memory store connections fallback
let inMemoryStoreConnections: any[] = [
  {
    id: 'conn_shopify_1',
    userId: 'usr_admin_1',
    platform: 'Shopify',
    storeUrl: 'apex-global.myshopify.com',
    accessToken: 'shpat_live_mock_token_983172',
    consumerKey: null,
    consumerSecret: null,
    webhookSecret: 'shsec_mock_hmac_secret_4481',
    isActive: true,
    lastSyncAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 7 * 86400 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'conn_woo_1',
    userId: 'usr_admin_1',
    platform: 'WooCommerce',
    storeUrl: 'https://woo.apexbrands.com',
    accessToken: null,
    consumerKey: 'ck_live_mock_consumer_key_10492',
    consumerSecret: 'cs_live_mock_consumer_secret_9941',
    webhookSecret: 'wc_secret_mock_7721',
    isActive: true,
    lastSyncAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 86400 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function getStoreConnections(userId?: string) {
  if (prisma) {
    try {
      const whereClause = userId ? { userId } : {};
      return await prisma.storeConnection.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
      });
    } catch (e) {
      console.warn('Prisma getStoreConnections fallback:', e);
    }
  }

  if (userId) {
    return inMemoryStoreConnections.filter((c) => c.userId === userId || c.userId === 'usr_admin_1');
  }
  return inMemoryStoreConnections;
}

export async function getStoreConnectionById(id: string) {
  if (prisma) {
    try {
      return await prisma.storeConnection.findUnique({
        where: { id },
      });
    } catch (e) {
      console.warn('Prisma getStoreConnectionById fallback:', e);
    }
  }

  return inMemoryStoreConnections.find((c) => c.id === id) || null;
}

export async function getStoreConnectionByPlatform(platform: string, storeUrl?: string) {
  if (prisma) {
    try {
      return await prisma.storeConnection.findFirst({
        where: {
          platform,
          ...(storeUrl ? { storeUrl } : {}),
          isActive: true,
        },
      });
    } catch (e) {
      console.warn('Prisma getStoreConnectionByPlatform fallback:', e);
    }
  }

  return inMemoryStoreConnections.find(
    (c) =>
      c.platform.toLowerCase() === platform.toLowerCase() &&
      (!storeUrl || c.storeUrl.toLowerCase().includes(storeUrl.toLowerCase())) &&
      c.isActive
  ) || null;
}

export async function saveStoreConnection(data: {
  userId?: string;
  platform: 'Shopify' | 'WooCommerce';
  storeUrl: string;
  accessToken?: string | null;
  consumerKey?: string | null;
  consumerSecret?: string | null;
  webhookSecret?: string | null;
  isActive?: boolean;
}) {
  const defaultUserId = data.userId || 'usr_admin_1';

  if (prisma) {
    try {
      return await prisma.storeConnection.upsert({
        where: {
          userId_platform_storeUrl: {
            userId: defaultUserId,
            platform: data.platform,
            storeUrl: data.storeUrl,
          },
        },
        update: {
          accessToken: data.accessToken,
          consumerKey: data.consumerKey,
          consumerSecret: data.consumerSecret,
          webhookSecret: data.webhookSecret,
          isActive: data.isActive ?? true,
          updatedAt: new Date(),
        },
        create: {
          userId: defaultUserId,
          platform: data.platform,
          storeUrl: data.storeUrl,
          accessToken: data.accessToken,
          consumerKey: data.consumerKey,
          consumerSecret: data.consumerSecret,
          webhookSecret: data.webhookSecret,
          isActive: data.isActive ?? true,
        },
      });
    } catch (e) {
      console.warn('Prisma saveStoreConnection fallback:', e);
    }
  }

  const existingIndex = inMemoryStoreConnections.findIndex(
    (c) =>
      c.platform.toLowerCase() === data.platform.toLowerCase() &&
      c.storeUrl.toLowerCase() === data.storeUrl.toLowerCase()
  );

  if (existingIndex >= 0) {
    inMemoryStoreConnections[existingIndex] = {
      ...inMemoryStoreConnections[existingIndex],
      accessToken: data.accessToken ?? inMemoryStoreConnections[existingIndex].accessToken,
      consumerKey: data.consumerKey ?? inMemoryStoreConnections[existingIndex].consumerKey,
      consumerSecret: data.consumerSecret ?? inMemoryStoreConnections[existingIndex].consumerSecret,
      webhookSecret: data.webhookSecret ?? inMemoryStoreConnections[existingIndex].webhookSecret,
      isActive: data.isActive ?? true,
      updatedAt: new Date().toISOString(),
    };
    return inMemoryStoreConnections[existingIndex];
  }

  const newConn = {
    id: `conn_${Date.now()}`,
    userId: defaultUserId,
    platform: data.platform,
    storeUrl: data.storeUrl,
    accessToken: data.accessToken || null,
    consumerKey: data.consumerKey || null,
    consumerSecret: data.consumerSecret || null,
    webhookSecret: data.webhookSecret || null,
    isActive: data.isActive ?? true,
    lastSyncAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  inMemoryStoreConnections.unshift(newConn);
  return newConn;
}

export async function updateStoreConnection(
  id: string,
  data: Partial<{
    isActive: boolean;
    lastSyncAt: Date | string;
    accessToken: string;
    consumerKey: string;
    consumerSecret: string;
    storeUrl: string;
  }>
) {
  if (prisma) {
    try {
      return await prisma.storeConnection.update({
        where: { id },
        data: {
          ...data,
          ...(data.lastSyncAt ? { lastSyncAt: new Date(data.lastSyncAt) } : {}),
          updatedAt: new Date(),
        },
      });
    } catch (e) {
      console.warn('Prisma updateStoreConnection fallback:', e);
    }
  }

  const conn = inMemoryStoreConnections.find((c) => c.id === id);
  if (!conn) return null;

  Object.assign(conn, {
    ...data,
    ...(data.lastSyncAt ? { lastSyncAt: new Date(data.lastSyncAt).toISOString() } : {}),
    updatedAt: new Date().toISOString(),
  });
  return conn;
}

export async function deleteStoreConnection(id: string) {
  if (prisma) {
    try {
      return await prisma.storeConnection.delete({
        where: { id },
      });
    } catch (e) {
      console.warn('Prisma deleteStoreConnection fallback:', e);
    }
  }

  const index = inMemoryStoreConnections.findIndex((c) => c.id === id);
  if (index >= 0) {
    const deleted = inMemoryStoreConnections.splice(index, 1);
    return deleted[0];
  }
  return null;
}

// ─── Custom AI Voice Prompt (per-tenant scripting) ───────────────────────────

/**
 * Retrieves the custom AI voice prompt for a user. Returns null if unset.
 */
export async function getCustomVoicePrompt(userId: string): Promise<string | null> {
  if (prisma) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { customVoicePrompt: true },
      });
      if (user) return user.customVoicePrompt ?? null;
    } catch (e) {
      console.warn('Prisma getCustomVoicePrompt fallback:', e);
    }
  }

  const user = inMemoryUsers.find((u) => u.id === userId);
  return user?.customVoicePrompt ?? null;
}

/**
 * Saves (overwrites) the custom AI voice prompt for a user.
 */
export async function saveCustomVoicePrompt(userId: string, prompt: string): Promise<void> {
  if (prisma) {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { customVoicePrompt: prompt },
      });
      return;
    } catch (e) {
      console.warn('Prisma saveCustomVoicePrompt fallback:', e);
    }
  }

  const userIndex = inMemoryUsers.findIndex((u) => u.id === userId);
  if (userIndex !== -1) {
    inMemoryUsers[userIndex].customVoicePrompt = prompt;
    inMemoryUsers[userIndex].updatedAt = new Date().toISOString();
  }
}

// ─────────────────────────────────────────────────────────────────────────────

export async function upsertOrderFromIntegration(orderData: any) {
  if (prisma) {
    try {
      return await prisma.order.upsert({
        where: { orderNumber: orderData.orderNumber },
        update: {
          status: orderData.status || 'Pending',
          amount: orderData.amount,
          shippingAddress: orderData.shippingAddress,
          customerName: orderData.customerName,
          phone: orderData.phone,
          updatedAt: new Date(),
        },
        create: {
          orderNumber: orderData.orderNumber,
          channel: orderData.channel,
          channelOrderId: orderData.channelOrderId || null,
          customerName: orderData.customerName,
          customerEmail: orderData.customerEmail || null,
          phone: orderData.phone,
          amount: orderData.amount,
          currency: orderData.currency || 'USD',
          status: orderData.status || 'Pending',
          aiVerification: orderData.aiVerification || 'Pending',
          shippingAddress: orderData.shippingAddress || null,
          city: orderData.city || null,
          state: orderData.state || null,
          carrier: orderData.carrier || 'USPS Priority Mail',
        },
      });
    } catch (e) {
      console.warn('Prisma upsertOrderFromIntegration fallback:', e);
    }
  }

  const existingIndex = inMemoryOrders.findIndex((o) => o.orderNumber === orderData.orderNumber);
  if (existingIndex >= 0) {
    inMemoryOrders[existingIndex] = {
      ...inMemoryOrders[existingIndex],
      ...orderData,
      updatedAt: new Date().toISOString(),
    };
    return inMemoryOrders[existingIndex];
  }

  const newOrder = {
    id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    orderNumber: orderData.orderNumber,
    channel: orderData.channel,
    channelOrderId: orderData.channelOrderId || null,
    customerName: orderData.customerName,
    customerEmail: orderData.customerEmail || null,
    phone: orderData.phone,
    amount: orderData.amount,
    currency: orderData.currency || 'USD',
    status: orderData.status || 'Pending',
    aiVerification: orderData.aiVerification || 'Pending',
    shippingAddress: orderData.shippingAddress || null,
    city: orderData.city || null,
    state: orderData.state || null,
    carrier: orderData.carrier || 'USPS Priority Mail',
    trackingNumber: null,
    labelUrl: null,
    labelGenerated: false,
    itemsCount: orderData.itemsCount || 1,
    callLogs: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  inMemoryOrders.unshift(newOrder);
  return newOrder;
}
