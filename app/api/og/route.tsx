import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get('category') || 'Product Rankings';
    const country = searchParams.get('country') || 'Global';
    
    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* RankFinal Logo/Badge */}
          <div
            style={{
              background: 'rgba(251, 191, 36, 0.15)',
              border: '2px solid rgba(251, 191, 36, 0.4)',
              borderRadius: '50px',
              padding: '12px 32px',
              marginBottom: '40px',
              display: 'flex',
              alignItems: 'center',
              color: '#FBBF24',
              fontSize: '28px',
              fontWeight: '700',
            }}
          >
            RankFinal.com
          </div>
          
          {/* Main Title */}
          <div
            style={{
              fontSize: '72px',
              fontWeight: '900',
              color: 'white',
              textAlign: 'center',
              lineHeight: 1.2,
              marginBottom: '24px',
              maxWidth: '1000px',
            }}
          >
            Best {category}
          </div>
          
          {/* Country */}
          <div
            style={{
              fontSize: '56px',
              fontWeight: '700',
              color: '#FBBF24',
              textAlign: 'center',
              marginBottom: '40px',
            }}
          >
            in {country}
          </div>
          
          {/* Subtitle */}
          <div
            style={{
              fontSize: '32px',
              color: '#9CA3AF',
              textAlign: 'center',
              maxWidth: '900px',
              lineHeight: 1.4,
            }}
          >
            AI-powered rankings • Verified independent sources • No sponsored content
          </div>
          
          {/* Bottom bar */}
          <div
            style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              right: '0',
              height: '8px',
              background: 'linear-gradient(90deg, #FBBF24 0%, #F59E0B 100%)',
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
