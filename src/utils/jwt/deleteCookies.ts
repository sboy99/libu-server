import type { Response } from 'express';

const deleteCookies = (res: Response, ...cookies: string[]) => {
  cookies.forEach((cookie) => {
    res.cookie(cookie, 'logout', {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
  });
};

export default deleteCookies;
