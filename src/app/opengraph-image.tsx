import { ImageResponse } from 'next/og';
 
export const runtime = 'edge';
export const alt = 'Ресторант Делиорман';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#d4af37',
          fontFamily: 'serif',
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 20 }}>
          Ресторант Делиорман
        </div>
        <div style={{ fontSize: 40, color: '#ffffff' }}>
          Автентична българска кухня
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
