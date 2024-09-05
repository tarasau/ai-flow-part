import { apiClient } from './api-client';
import { saveTokens } from './save-token';

export async function refreshToken() {
  const refreshToken = localStorage.getItem('refresh_token') || '';
  const response = await apiClient.auth.token.$post({
    json: { refresh_token: refreshToken },
  });
  saveTokens(await response.json());
}
