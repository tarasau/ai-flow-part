import { paths } from '../../router/paths';
import { deleteTokens } from './delete-tokens';

export function redirectToLogin() {
  deleteTokens();
  const params = new URLSearchParams({
    returnUrl: encodeURIComponent(window.location.pathname + window.location.search),
  });
  window.location.href = paths.signIn() + `?${params}`;
}
