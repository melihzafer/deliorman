import { NextResponse } from 'next/server';
import menuData from '@data/menu.json';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: menuData
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch menu data'
      },
      { status: 500 }
    );
  }
}
