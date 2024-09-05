export const paths = {
  dashboard: () => '/',
  flows: () => '/flows',
  signIn: () => '/sign-in',
  signUp: () => '/sign-up',
  flowDetails: (id = ':id') => `/flow/${id}`,
  aiProviders: () => '/ai-providers',
} as const;
