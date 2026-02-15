import { AppError } from '@/types/customError';
import { SignJWT, jwtVerify, JWTPayload } from 'jose';

const ACCESS_SECRET = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);
const REFRESH_SECRET = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET!);

if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
  throw new Error('JWT secrets not set in environment');
}

interface TokenPayload extends JWTPayload {
  userId: number;
  phone: string;
  role: string;
  completed: boolean;
  verified: boolean;
}

// Create access token (short-lived)
export async function createAccessToken(payload: TokenPayload): Promise<string> {
  const expiry = process.env.ACCESS_TOKEN_EXPIRY || '15m';

  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiry)
    .sign(ACCESS_SECRET);
}

// Create refresh token (long-lived)
export async function createRefreshToken(payload: { userId: number }): Promise<string> {
  const expiry = process.env.REFRESH_TOKEN_EXPIRY || '7d';

  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiry)
    .sign(REFRESH_SECRET);
}

// Verify access token & attach to req
export async function verifyAccessToken(token: string): Promise<TokenPayload> {
  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET, {
      algorithms: ['HS256'],
    });
    return payload as TokenPayload;
  } catch (error) {
    throw new AppError('Invalid access token.', 401, true);
  }
}

// Verify refresh token
export async function verifyRefreshToken(token: string): Promise<{ userId: number }> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET, {
      algorithms: ['HS256'],
    });
    return payload as { userId: number };
  } catch (error) {
    throw new AppError('Invalid refresh token.', 401, true);
  }
}
