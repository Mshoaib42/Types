import "express";

declare global {
  namespace Express {
    export interface Request {
      routeName?: string;
    }
  }
}

declare namespace Express {
  export interface Request {
    routeName?: string;
  }
}
