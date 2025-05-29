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
    Transaction: 'queue_transaction',
  },
  Exchange: {
    Email: 'exchange_email',
    Transaction: 'exchange_transaction',
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
    TryoutCategories: 'tryout_categories',
    TryoutPackages: 'tryout_packages',
    TryoutPackageDetails: 'tryout_package_details',
    QuestionTypes: 'question_types',
    Questions: 'questions',
    QuestionAnswers: 'question_answers',
    TryoutQuestionMapping: 'tryout_question_mapping',
  },
  PrimaryKey: {
    Role: 'role_id',
    User: 'user_id',
    FileStorage: 'file_id',
    Menu: 'menu_id',
    Permission: 'permission_id',
    RolePermission: 'role_permission_id',
    MenuPermission: 'menu_permission_id',
    TryoutCategories: 'category_id',
    TryoutPackages: 'package_id',
    TryoutPackageDetails: 'package_detail_id',
    QuestionTypes: 'question_type_id',
    Questions: 'question_id',
    QuestionAnswers: 'answer_id',
    TryoutQuestionMapping: 'tryout_question_id',
  },
};

export const CS_DbProcedure = {};
