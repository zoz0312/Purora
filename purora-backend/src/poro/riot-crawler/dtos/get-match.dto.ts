export class GetUserCustomMatchInput {
  id_token: string; // User Token
  PVPNET_ID_KR: number; // USER ID
  beginIndex: number;
  endIndex: number;
}

export class GetUserCustomMatchOutput {
  data?: any;
  error?: string;
}