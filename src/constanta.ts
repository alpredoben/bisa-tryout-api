import { Environments as cfg } from './environments'

export const CS_LogActivity = {
  Label: {
    Auth: 'Authentikasi'
  },
  Api: {
    Auth: {
      Login: 'Pengguna Berhasil Masuk',
      Register: 'Pengguna Berhasil Mendaftarkan Akunnya'
    }
  }
}

export const CS_Notification = {
  Topic: {
    User: 'Master Pengguna'
  },
  Event: {
    User: {
      Create: (value: string) => `Berhasil menambahkan pengguna baru ${value}`,
      Update: (value: string) => `Berhasil mengubah pengguna ${value}`,
      Delete: (value: string) => `Berhasil menghapus pengguna ${value}`,
      ChangePassword: (value: string) => `Berhasil mengubah password pengguna ${value}`,
      LoginAs: (user: string) => `Pengguna ${user} login menggunakan akun anda`
    }
  },
  Type: {
    Info: 'information',
    Error: 'error',
    Success: 'success',
    Warn: 'warning'
  }
}

export const CS_LogType = {
  Auth: {
    Register: 'register',
    Login: 'login',
  }
}

export const CS_MessageBroker = {
  Queue: {
    Email: 'queue_email',
    LogActivity: 'queue_log_activity',
  },
  Exchange: {
    Email: 'exchange_email',
    LogActivity: 'exchange_log_activity',
  }
}

export const CS_MailHeader = {
  forgotPassword: {
    subject: 'Request Reset Password and Receive New Token/OTP',
    template: 'forgotPassword',
    cc: ''
  },
  additional: {
    customer_phone: cfg.CustomerPhone,
    customer_email: cfg.CustomerEmail
  }
}

export const CS_DbSchema = {
  TableName: {
    Role: 'master_role',
    User: 'master_user'
  },
  PrimaryKey: {
    Role: 'role_id',
    User: 'user_id'
  }
}

export const CS_DbProcedure = {}


