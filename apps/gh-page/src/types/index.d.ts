declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    PORT: string;
    MYSQL_HOST: string;
    MYSQL_PORT: string;
    MYSQL_USERNAME: string;
    MYSQL_PASSWORD: string;
    MYSQL_DATABASE: string;
    FIREBASE_CLIENT_EMAIL: string;
    FIREBASE_PROJECT_ID: string;
    FIREBASE_PRIVATE_KEY: string;
  }
}
