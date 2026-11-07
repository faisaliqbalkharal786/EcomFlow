import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCustomVoicePrompt, saveCustomVoicePrompt } from '@/lib/db';

/**
 * GET /api/settings/prompt
 * Returns the authenticated user's current custom AI voice prompt.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID not found in session' }, { status: 400 });
    }

    const customVoicePrompt = await getCustomVoicePrompt(userId);

    return NextResponse.json({ success: true, customVoicePrompt }, { status: 200 });
  } catch (error: any) {
    console.error('[GET /api/settings/prompt] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: error?.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/settings/prompt
 * Saves a custom AI voice prompt for the authenticated user/workspace.
 * Accepts: { customVoicePrompt: string }
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID not found in session' }, { status: 400 });
    }

    const body = await request.json();
    const { customVoicePrompt } = body;

    if (typeof customVoicePrompt !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Bad Request', message: '"customVoicePrompt" must be a string.' },
        { status: 400 }
      );
    }

    // Allow empty string to clear the prompt (falls back to default Urdu prompt)
    const trimmedPrompt = customVoicePrompt.trim();

    await saveCustomVoicePrompt(userId, trimmedPrompt);

    return NextResponse.json(
      {
        success: true,
        message: trimmedPrompt
          ? 'Custom AI voice script saved successfully. Your AI caller will now use this script.'
          : 'Custom script cleared. AI caller will use the default Urdu prompt.',
        customVoicePrompt: trimmedPrompt || null,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[PATCH /api/settings/prompt] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: error?.message },
      { status: 500 }
    );
  }
}
