declare global {
    namespace NodeJS {
      interface ProcessEnv {
        MONGODB_URI: string;
        PORT: string;
        JWT_SECRET: string;
        EMAIL_USER: string;
        EMAIL_PASS: string;
        NODE_ENV: 'development' | 'production';
      }
    }
  }
  
  export {};