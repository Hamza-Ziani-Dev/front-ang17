import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authReq = req.clone({
    headers: req.headers.set(
      'Authorization',
      'Basic YWNhcHMuaGFtemE6ZVgtMzlmdmVjTg=='
    ),
  });

  console.log("authInterceptor");


  return next(authReq);
};
