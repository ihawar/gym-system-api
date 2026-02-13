import { AppError } from '@/types/customError';

export default function parsePhone(txt: string): string {
  let phone = '98';
  if (txt.startsWith('09') && txt.length == 11) {
    phone += txt.substring(1);
  } else if (txt.startsWith('+989') && txt.length == 13) {
    phone += txt.substring(3);
  } else if (txt.startsWith('989') && txt.length == 12) {
    phone += txt.substring(2);
  } else if (txt.startsWith('9') && txt.length == 10) {
    phone += txt;
  }

  if (/^989\d{9}$/.test(phone)) {
    return phone;
  } else {
    throw new AppError('Invalid phone number format.', 401, true);
  }
}
