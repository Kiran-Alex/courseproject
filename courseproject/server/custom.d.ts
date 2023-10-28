declare namespace NodeJS {
    interface ProcessEnv {
      FRONTEND_URL : string 
      PORT: string;
      DATABASE_URL: string;
      STRIPE_KEY: string;
      SECRET: string;
        PORT :number;
    }
  }
  