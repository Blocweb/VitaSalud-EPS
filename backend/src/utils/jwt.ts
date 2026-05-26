import * as jwt from 'jsonwebtoken';
import { env } from '../config/env';

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export const generateToken = (payload: TokenPayload): string => {
  return (jwt.sign as any)(payload, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = (jwt.verify as any)(token, env.jwt.secret) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const decoded = (jwt.decode as any)(token) as TokenPayload | null;
    return decoded;
  } catch (error) {
    return null;
  }
};

export default {
  generateToken,
  verifyToken,
  decodeToken,
};
