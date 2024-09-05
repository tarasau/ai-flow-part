export type Config = {
  dbUrl: string;
  env: 'local' | 'prod';
};

export const getConfig = (): Config => ({
  dbUrl: process.env.DB_URL!,
  env: process.env.ENV === 'production' ? 'prod' : 'local',
});
