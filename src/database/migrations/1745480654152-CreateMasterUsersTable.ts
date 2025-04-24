import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMasterUsersTable1745480654152 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE master_users (
          user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          role_id UUID DEFAULT NULL,
          full_name VARCHAR(255) DEFAULT NULL,
          email VARCHAR(255) UNIQUE,
          password LONGTEXT NOT NULL,
          salt LONGTEXT NULL DEFAULT NULL,
          refresh_token LONGTEXT NULL DEFAULT NULL,
          photo LONGTEXT NULL DEFAULT NULL,
          phone_number VARCHAR(30) NULL DEFAULT NULL,
          email_verified_token LONGTEXT NULL DEFAULT NULL,
          email_verified_expired TIMESTAMP NULL,
          otp_code TEXT NULL DEFAULT NULL,
          otp_expired TIMESTAMP NULL DEFAULT NULL,
          is_active BOOLEAN DEFAULT FALSE,
          last_ip TEXT NULL DEFAULT NULL,
          last_hostname TEXT NULL DEFAULT NULL,
          last_login_at TIMESTAMP NULL DEFAULT NULL,
          registered_at TIMESTAMP NULL DEFAULT NULL,
          verified_at TIMESTAMP NULL DEFAULT NULL,
          password_change_at TIMESTAMP NULL DEFAULT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          created_by UUID NULL DEFAULT NULL,
          updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
          updated_by UUID NULL DEFAULT NULL,
          deleted_at TIMESTAMP NULL,
          deleted_by UUID NULL DEFAULT NULL,
          CONSTRAINT fk_user_role_id FOREIGN KEY (role_id) REFERENCES master_roles(role_id) ON DELETE SET NULL
        );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE master_users`);
  }
}
