export interface TokenPayload {
  id: string;
  email: string;
  username: string;
}

export interface RefreshTokenPayload {
  id: string;
  tokenVersion?: number;
}
