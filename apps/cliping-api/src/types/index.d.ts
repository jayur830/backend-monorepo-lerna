declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    PORT: string;
    MYSQL_HOST: string;
    MYSQL_DATABASE: string;
    MYSQL_PORT: string;
    MYSQL_USERNAME: string;
    MYSQL_PASSWORD: string;
    FIREBASE_CLIENT_EMAIL: string;
    FIREBASE_PRIVATE_KEY: string;
    FIREBASE_PROJECT_ID: string;
    NAVER_APP_CLIENT_ID: string;
    NAVER_APP_CLIENT_SECRET: string;
  }
}
