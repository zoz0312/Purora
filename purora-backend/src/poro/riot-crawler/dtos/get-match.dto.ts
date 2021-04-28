export class GetUserCustomMatchInput {
  id_token: string; // User Token
  PVPNET_ID_KR: string; // USER ID
}

export class GetUserCustomMatchOutput {
  data?: object;
  error?: string;
}