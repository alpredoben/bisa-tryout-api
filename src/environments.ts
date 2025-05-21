import dotenv from 'dotenv';
dotenv.config();

export const IsProduction: boolean = process.env.NODE_ENV?.toString() === 'production';
export const SaltRounds: number = 10;

const getUrlRabbitMQ = (): string => {
  const rmqList = {
    host: process?.env?.RABBITMQ_HOST ?? 'localhost',
    port: process?.env?.RABBITMQ_PORT ?? '5672',
    user: process?.env?.RABBITMQ_USER ?? null,
    password: process?.env?.RABBITMQ_PASS ?? null,
  };

  if (rmqList?.user == null) {
    return `amqp://${rmqList.host}:${rmqList.port}`;
  }

  return `amqp://${rmqList.user}:${rmqList.password}@${rmqList.host}:${rmqList.port}`;
};

const getContentSecurePolice = (): string | any => {
  if (IsProduction) {
    return process?.env?.APP_CONTENT_SECURITY_POLICY_PROD;
  }
  return process?.env?.APP_CONTENT_POLICY_DEV;
};

export const Environments = {
  // Application
  AppHost: process.env.APP_HOST || 'http://localhost',
  AppName: process.env.APP_NAME?.toString() || 'boiler-api-core',
  AppPort: Number(process.env.APP_PORT) || 7701,
  AppLang: process.env.APP_LANG?.toString() || 'en',
  AppEnv: process.env.NODE_ENV?.toString() || 'development',
  AppAuthor: process.env.APP_AUTHOR?.toString() || 'Ruben Alpredo Tampubolon',
  AppDebug: Boolean(process.env.APP_DEBUG?.toString().toLowerCase()) || true,
  AppPermissionPolicy: process?.env?.APP_PERMISSION_POLICY ?? '',
  AppProtection: process?.env?.APP_PROTECTION ?? '',
  AppContentSecurityPolicy: getContentSecurePolice(),
  AppJsonLimit: process?.env?.APP_JSON_LIMIT ? `${process?.env?.APP_JSON_LIMIT}kb` : '500000kb',
  AppMethod: process?.env?.APP_METHOD ?? 'POST,PUT,DELETE,GET,OPTIONS',
  AppAllowHeader: process?.env?.APP_ALLOW_HEADER ?? 'POST,PUT,DELETE,GET,OPTIONS',
  AppExposeHeader: process?.env?.APP_EXPOSE_HEADER ?? 'POST,PUT,DELETE,GET,OPTIONS',

  // Domain
  DomainApi: process?.env?.DOMAIN_API || '',
  DomainClient: process?.env?.DOMAIN_CLIENT || '',

  // Database
  DbDriver: process.env.DB_DRIVER?.toString() || 'postgre',
  DbHost: process.env.DB_HOST?.toString() || 'localhost',
  DbPort: Number(process.env.DB_PORT) || 5432,
  DbUser: process.env.DB_USER?.toString() || 'admin',
  DbPass: process.env.DB_PASS?.toString() || 'password',
  DbName: process.env.DB_NAME?.toString() || 'db_boiler',

  // Secret
  JwtSecretKey: process.env.JWT_SECRET_KEY?.toString() || 'k5d5m4i6vgNt6OyGtnxX8vpYAY2O5dh',
  PasswordDefault: process.env.PASSWORD_DEFAULT?.toString() || '2LqTzAbiVClp29t',

  // Redis
  RedisHost: process.env.REDIS_HOST?.toString() || 'localhost',
  RedisPort: Number(process.env.REDIS_PORT) || 6379,
  RedisPass: process.env.REDIS_PASS?.toString() || 'G4Z8z2VYGfMK2E7',

  // RabbitMQ
  RabbitMqUrl: getUrlRabbitMQ(),

  // Mail SMTP
  MailDriver: process.env.MAIL_DRIVER ?? 'smtp',
  MailHost: process.env.MAIL_HOST ?? 'smtp.mailtrap.io',
  MailPort: Number(process.env.MAIL_PORT ?? '2525'),
  MailUser: process.env.MAIL_USERNAME ?? 'd010bd981faee5',
  MailPass: process.env.MAIL_PASSWORD ?? 'aac26c8b410877',
  MailSecure: process.env.MAIL_SECURE?.toLowerCase() == 'false' ? false : true,
  MailFrom: process.env.MAIL_FROM ?? 'support@gmail.com',
  MailAlert: process.env.MAIL_ALERT_LIST ?? 'alpredo.tampubolon@gmail.com',
  MailIgnoreTLS: Boolean(process.env.MAIL_IGNORE_TLS ?? 'false'),

  // Minio Storage
  MinioHost: process.env.MINIO_ENDPOINT ?? 'localhost',
  MinioPort: (process.env.MINIO_PORT ?? 9000).toString(),
  MinioUseSSL: process.env.MINIO_USE_SSL ?? false,
  MinioUser: process.env.MINIO_ROOT_USER ?? 'admin',
  MinioPass: process.env.MINIO_ROOT_PASSWORD ?? 'admin',
  MinioBucketName: process.env.MINIO_BUCKET_NAME ?? 'admin-bucket',
};
