import { Request, Response } from "express";


export function responseHtmlWrapper(callback: Function) {
  return async function (request: Request, response: Response) {
    try {
      const responseValue = await callback(...arguments);
      if (!responseValue) {
        response.send("<h1>Oops Not Content</h1>");
        return false;
      };
      response.send(responseValue);
      return false;
    } catch (error) {
      response.send(error.message);
    };
  };
};