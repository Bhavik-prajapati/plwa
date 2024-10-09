import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  if(state.url.includes('token')){
    const gtoken=state.url.split('=');
    const parsedUrl = new URL('http://localhost:4200'+state.url);
    const params = new URLSearchParams(parsedUrl.search);
    const token = params.get("token") || "";  // Fallback to an empty string if null
    const refreshToken = params.get("refreshtoken") || "";
    localStorage.setItem("token",token);
    localStorage.setItem("refreshtoken",refreshToken);
  }
  const token = localStorage.getItem('token');
  const router = inject(Router);
  if (token) {
    if (state.url.includes('/login') || state.url.includes('/signup')) {
      router.navigateByUrl('home');
      return false;
    }
    return true; 
  } else {
    router.navigateByUrl('login');
    return false;
  }
};
