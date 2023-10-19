export interface Config {
  mongo: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
  server: { 
    secret: string; 
    mongoConnect: string 
  };
  //logging 
  logging: {
    levels: {};
    colors: {};
    silent: boolean;
    level: string;
    file: string;
  };
}
