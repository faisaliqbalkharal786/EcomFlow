import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { findUserByEmail, createUser } from '@/lib/db';

/**
 * POST /api/register
 * Enterprise Sign-Up endpoint for EcomFlow.
 * Hashes passwords with bcryptjs and creates a User with associated workspaceName.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, workspaceName } = body;

    // 1. Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Validation Error', message: 'Name must be at least 2 characters.' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Validation Error', message: 'Please provide a valid corporate email address.' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Validation Error', message: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 2. Check if user already exists
    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'User Conflict',
          message: 'An account with this email address already exists. Please log in.',
        },
        { status: 409 }
      );
    }

    // 3. Hash password with bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user in database
    const newUser = await createUser({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      workspaceName: workspaceName?.trim() || `${name.trim()}'s Global Stores`,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully. You can now log in.',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          workspaceName: newUser.workspaceName,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error in /api/register:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        message: error?.message || 'Failed to complete registration.',
      },
      { status: 500 }
    );
  }
}
