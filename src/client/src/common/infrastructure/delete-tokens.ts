export function deleteTokens() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('token_expiration');
  localStorage.removeItem('refresh_token');
}
