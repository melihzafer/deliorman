import { NextResponse } from 'next/server';
import menuData from '@data/menu.json';
import type { MenuData } from '@/src/types';

interface MenuSuccessResponse {
  success: true;
  data: MenuData;
}

interface MenuErrorResponse {
  success: false;
  error: string;
}

type MenuRouteResponse = MenuSuccessResponse | MenuErrorResponse;

export async function GET(): Promise<NextResponse<MenuRouteResponse>> {
  try {
    return NextResponse.json<MenuSuccessResponse>({
      success: true,
      data: menuData as MenuData,
    });
  } catch {
    return NextResponse.json<MenuErrorResponse>(
      {
        success: false,
        error: 'Failed to fetch menu data',
      },
      { status: 500 },
    );
  }
}
