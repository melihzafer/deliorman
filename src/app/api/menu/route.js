import { NextResponse } from 'next/server';
import menuData from '@data/menu.json';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: menuData
    });
  } catch (error) {
    console.error('Menu API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch menu data'
      },
      { status: 500 }
    );
  }
}
