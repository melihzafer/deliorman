import { NextResponse } from 'next/server';
import { getLocalizedMenuData } from '@data/getLocalizedMenuData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'bg';
    const data = getLocalizedMenuData(locale);
    
    return NextResponse.json({
      success: true,
      categories: data.categories || [],
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menu data' },
      { status: 500 }
    );
  }
}