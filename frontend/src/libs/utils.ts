import { JWTPayload, jwtVerify } from 'jose';

export interface MyJWTPayload extends JWTPayload {
  user_id?: number;
  disabled?: boolean;
}

export const getJwtSecretKey = () => {
  const secretKey = process.env.JWT_SECRET_KEY;
  if (!secretKey) throw new Error('Jwt secret key is not available');

  return new TextEncoder().encode(secretKey);
};

export async function verifyJwtToken(token: string | undefined): Promise<null | MyJWTPayload> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    return payload as MyJWTPayload;
  } catch (error) {
    return null;
  }
}
