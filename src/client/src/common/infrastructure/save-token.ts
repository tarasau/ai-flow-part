import { TokensData } from './tokens-data';

export function saveTokens(tokens: TokensData) {
  localStorage.setItem('access_token', tokens.access_token);
  localStorage.setItem(
    'token_expiration',
    (Math.floor(Date.now() / 1000) + tokens.expires_in).toString(),
  );
  localStorage.setItem('refresh_token', tokens.refresh_token);
}
