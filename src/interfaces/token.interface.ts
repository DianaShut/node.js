export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface IToken extends ITokenPair {
  _id?: string; // id токена
  _userId: string; // id користувача
}

export interface ITokenResponse extends ITokenPair {
  accessExpiresIn: string;
  refreshExpiresIn: string;
}
