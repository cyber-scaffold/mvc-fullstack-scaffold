import { Request, Response } from "express";

interface IOptions {
  successPadding?(value: any): any;
  errorPadding?(value: any): any
};

const default_options = {
  successPadding: (response_value: any) => {
    return { code: 0, data: response_value || null, message: "ok" };
  },
  errorPadding: (message: any) => {
    return { code: 10000, data: null, message };
  }
};

export function responseJsonWrapper(callback: Function, options?: IOptions) {
  const { successPadding, errorPadding } = Object.assign({}, default_options, options);
  return async function (request: Request, response: Response) {
    try {
      const response_value = await callback(...arguments);
      if (!response_value) {
        response.send(successPadding(response_value));
        return false;
      };
      response.send(successPadding(response_value));
      return false;
    } catch (error: any) {
      response.send(errorPadding(error.message));
    };
  };
};