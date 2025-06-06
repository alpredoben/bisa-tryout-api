import dayjs from 'dayjs';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Environments as cfg } from '../environments';

import { randomInt } from 'crypto';
import { I_ResultProcess } from '../interfaces/app.interface';

/**
 * Generates a new UUID v4.
 * @returns A UUID v4 string.
 */
export const generateUUID = (): string => {
  return uuidv4();
};

/**
 * Normalizes an email address (e.g., trim and lowercase).
 * @param email - The email address to normalize.
 * @returns The normalized email address.
 */
export const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

/**
 * Formats a timestamp to a readable date-time string.
 * @param date - The date to format.
 * @returns A formatted string (e.g., "YYYY-MM-DD HH:mm:ss").
 */
export const formatTimestamp = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  return new Intl.DateTimeFormat('en-US', options).format(date).replace(',', '');
};

/** Generate Slug Name */
export const generateSlug = (name: string): string | null => {
  if (name != null && name != undefined) {
    return name
      .toLowerCase() // Convert to lowercase
      .trim() // Remove any leading or trailing spaces
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^a-z0-9\-]/g, '') // Remove any non-alphanumeric characters except hyphens
      .replace(/--+/g, '-');
  }

  return null;
};

export const standartDateISO = (format: string = '') => {
  if (format != '') {
    return dayjs().format(format);
  }
  return dayjs().format();
};

export const formatDateToday = (format: string = 'YYYY-MM-DD HH:mm:ss', date: any = standartDateISO()) => {
  const newDate = dayjs(date).format(format);
  return newDate;
};

export const getDurationInMilliseconds = (start = process.hrtime()) => {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

export const debugRequestHandler = (req: Request) => {
  if (Boolean(cfg.AppDebug) == true) {
    const ALLOWED_LOG = ['local', 'development', 'staging'];
    console.log(`=========== Incoming Request ${formatDateToday()} ===========`);
    if (ALLOWED_LOG.includes(cfg.AppEnv)) {
      console.log('Headers:', req?.headers);
    }
    console.log('Query:', JSON.stringify(req?.query));
    console.log('Param:', JSON.stringify(req?.params));
    console.log('Body:', JSON.stringify(req?.body));
  }
};

export const generateOTPCode = (length: number = 6): string => {
  if (length <= 0) throw new Error('Length must be greater than 0');

  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;

  return randomInt(min, max + 1).toString();
};

export const getTotalDays = (start: Date, end: Date): number => {
  const startTimestamp: number = new Date(start).getTime();
  const endTimestamp: number = new Date(end).getTime();
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const num = Math.abs(endTimestamp - startTimestamp) / millisecondsPerDay;

  if (num >= 0.465) {
    return Math.ceil(num);
  }
  return Math.floor(num);
};

export const getTotalMinutes = (start: Date, end: Date): number => {
  const startTimestamp: number = new Date(start).getTime();
  const endTimestamp: number = new Date(end).getTime();

  const millisecondsPerMinute = 1000 * 60;
  return Math.abs(endTimestamp - startTimestamp) / millisecondsPerMinute;
};

export const splitFullName = (fullName: string): { [key: string]: any } => {
  if (fullName != '' && fullName != null) {
    const parts = fullName.trim().split(/\s+/);
    const lastName = parts.pop(); // remove and get the last element
    const firstName = parts.join(' '); // join the rest as first name
    return {
      first_name: firstName,
      last_name: lastName,
    };
  }

  return {
    first_name: null,
    last_name: null,
  };
};

export const getHostProtocol = (req: Request): string => {
  const protocol = req.protocol;
  const host = req.get('host'); // includes hostname and port
  return `${protocol}://${host}`;
};

export const getBaseUrl = (req: Request, path: string): string => {
  return `${getHostProtocol(req)}/api/v1/${path}/files`;
};

export const getLastWeekRange = (): any => {
  const now = new Date(); // contoh: 2025-04-21

  // Awal hari ini
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // 7 hari ke belakang
  const startOfLastWeek = new Date(startOfToday);
  startOfLastWeek.setDate(startOfToday.getDate() - 7);

  // Untuk batas akhir, bisa pakai hari berikutnya biar rentangnya eksklusif
  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfToday.getDate() + 1);

  return {
    startOfLastWeek,
    startOfTomorrow,
  };
};

export const getRangeThisMonth = (): any => {
  const now: Date = new Date();
  const startOfMonth: Date = new Date(now.getFullYear(), now.getMonth(), 1); // 2025-04-01

  // Akhir bulan ini (pakai awal bulan depan lalu kurangi 1 detik)
  const startOfNextMonth: Date = new Date(now.getFullYear(), now.getMonth() + 1, 1); // 2025-05-01

  // batasnya jam 23:59:59, bisa juga:
  const endOfMonth: Date = new Date(startOfNextMonth.getTime() - 1000);
  return {
    startOfMonth,
    startOfNextMonth,
    endOfMonth,
  };
};

export const getRangeToday = (): any => {
  const now = new Date();
  // Awal hari ini (00:00:00)
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Awal hari besok (untuk batas akhir exclusive)
  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfToday.getDate() + 1);
  return { startOfToday, startOfTomorrow };
};

export const ensureArray = (value: unknown): I_ResultProcess => {
  if (value === undefined || value === null) {
    return {
      success: false,
      message: 'Value is null or undefined',
      data: value,
    };
  }

  if (Array.isArray(value)) {
    return {
      success: true,
      message: 'Value is array',
      data: value,
    };
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return {
          success: true,
          message: 'Value is array',
          data: parsed,
        };
      } else {
        return {
          success: false,
          message: 'Value is string. Parsed string is not an array',
          data: value,
        };
      }
    } catch (err: any) {
      return {
        success: false,
        message: 'Failed to convert string to array',
        data: err,
      };
    }
  }

  return {
    success: false,
    message: 'Value is not an array or a valid array string',
    data: value,
  };
};
