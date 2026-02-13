import 'dotenv';
import type { OTP } from '@prisma/client';
import { CREATE_ACCOUNT_MESSAGE, RESET_PASSWORD_MESSAGE, KAVENEGRAR_URL } from '@/templates/otp';

export function generateOTPCode(length: number = 6): string {
  return Math.floor(Math.random() * Math.pow(10, length)).toString();
}

export async function sendOTP(otp: OTP) {
  // prepare the message
  let msg = otp.type === 'REGISTER' ? CREATE_ACCOUNT_MESSAGE : RESET_PASSWORD_MESSAGE;
  msg = msg.replace('{code}', otp.code);
  // prepare the URL
  let url = KAVENEGRAR_URL.replace('{api_key}', process.env.KAVENEGRA_KEY || '')
    .replace('{recipient}', otp.phone)
    .replace('{sender}', process.env.KAVENEGAR_SENDER || '')
    .replace('{msg}', msg);

  // send the request
  const res = await fetch(url, {
    method: 'GET',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OTP Not send ${res.status}: ${text}`);
  }
}
