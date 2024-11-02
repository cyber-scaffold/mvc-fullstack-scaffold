import { Request, Response } from "express";


export function responseHtmlWrapper(callback: Function) {
  return async (request: Request, response: Response) => {
    try {
      const responseValue = await callback(...arguments);
      response.send(responseValue);
      return false;
    } catch (error) {
      response.send(error.message);
    };
  };
};