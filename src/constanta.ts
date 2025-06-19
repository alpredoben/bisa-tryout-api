export const CS_LogActivity = {
  Label: {
    Auth: 'Authentikasi',
  },
  Api: {
    Auth: {
      Login: 'Pengguna Berhasil Masuk',
      Register: 'Pengguna Berhasil Mendaftarkan Akunnya',
    },
  },
};

export const CS_Notification = {
  Topic: {
    User: 'Master Pengguna',
  },
  Event: {
    User: {
      Create: (value: string) => `Berhasil menambahkan pengguna baru ${value}`,
      Update: (value: string) => `Berhasil mengubah pengguna ${value}`,
      Delete: (value: string) => `Berhasil menghapus pengguna ${value}`,
      ChangePassword: (value: string) => `Berhasil mengubah password pengguna ${value}`,
      LoginAs: (user: string) => `Pengguna ${user} login menggunakan akun anda`,
    },
  },
  Type: {
    Info: 'information',
    Error: 'error',
    Success: 'success',
    Warn: 'warning',
  },
};

export const CS_LogType = {
  Auth: {
    Register: 'register',
    Login: 'login',
  },
};

export const CS_MessageBroker = {
  Queue: {
    Email: 'queue_email',
    HistoryTryout: 'queue_history_tryout',
  },
  Exchange: {
    Email: 'exchange_email',
    Transaction: 'exchange_transaction',
    HistoryTryout: 'exchange_history_tryout',
  },
};

export const CS_MailHeader = {
  forgotPassword: {
    subject: 'Request Reset Password and Receive New Token/OTP',
    template: 'forgotPassword',
    cc: '',
  },
  additional: {
    customer_phone: null,
    customer_email: null,
  },
};

export const CS_DbSchema = {
  TableName: {
    Role: 'master_roles',
    User: 'master_users',
    FileStorage: 'file_storages',
    Menu: 'master_menu',
    Permission: 'master_permissions',
    RolePermission: 'role_permissions',
    MenuPermission: 'menu_permissions',
    Organizations: 'organizations',
    TryoutCategories: 'tryout_categories',
    TryoutStages: 'tryout_stages',
    TryoutTypes: 'tryout_types',
    TryoutPackages: 'tryout_packages',
    TryoutDetails: 'tryout_details',
    Questions: 'questions',
    Answers: 'answers',
    Discussion: 'discussions',
    HistoryReportTryout: 'history_reported_tryout',
  },
  PrimaryKey: {
    Role: 'role_id',
    User: 'user_id',
    FileStorage: 'file_id',
    Menu: 'menu_id',
    Permission: 'permission_id',
    RolePermission: 'role_permission_id',
    MenuPermission: 'menu_permission_id',
    Organizations: 'organization_id',
    TryoutCategories: 'category_id',
    TryoutStages: 'stage_id',
    TryoutTypes: 'type_id',
    TryoutPackages: 'package_id',
    TryoutDetails: 'detail_id',
    Questions: 'question_id',
    Answers: 'answer_id',
    Discussion: 'discussion_id',
    HistoryReportTryout: 'history_id',
  },
};

export const CS_HistoryReportType = {
  import: {
    name: 'import',
    description: (value: string) => `Proses import file excel, yaitu data ${value}`,
  },
};

export const CS_StatusName = {
  onProgress: 'on progress',
  waiting: 'waiting',
  success: 'success',
  failed: 'failed',
  done: 'done',
  confirm: 'confirm',
  approve: 'approve',
};

export const CS_DbProcedure = {};

export const CS_TypeName = {
  TryoutPackage: 'tryout-package',
};
