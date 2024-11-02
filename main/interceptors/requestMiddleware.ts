import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {

    }
  }
};

/**
 * @description 在每个网络请求到达的时候创建的一个作用域
 * 如果存在类似于SessionService这样在每个网络请求的时候只初始化一次的服务
 * 就需要在这里添加给request
 * **/
export async function requestMiddleware(request: Request, response: Response, next: NextFunction) {

  next();
};