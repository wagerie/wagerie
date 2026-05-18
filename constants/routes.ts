export const API_ROUTES = {
  SIGNIN: '/auth/signin',
  SIGNUP: '/auth/signup',
  VERIFY_OTP: '/auth/verify-otp',
  RESEND_OTP: '/auth/resend-otp',
  FORGOT_PASSWORD: '/auth/forgot-password',
  VERIFY_FORGOT_PASSWORD_OTP: '/auth/verify-forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
} as const;

export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  OTP_VERIFICATION: '/auth/otp-verification',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: "/auth/forgot-password",
  VERIFY_FORGOT_PASSWORD: "/auth/verify-forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  DASHBOARD: "/dashboard"
} as const;
