import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTablesUsers1745480654152 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE master_users (
      user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE,
      password TEXT NOT NULL,
      role_id UUID NULL DEFAULT NULL,
      refresh_token TEXT NULL,
      photo JSONB NULL DEFAULT NULL,
      phone VARCHAR(20) NULL DEFAULT NULL,
      otp_code VARCHAR(255) DEFAULT NULL,
      otp_expired TIMESTAMP NULL DEFAULT NULL,
      has_verified BOOLEAN DEFAULT FALSE,
      last_ip TEXT DEFAULT NULL,
      last_hostname TEXT DEFAULT NULL,
      last_login TIMESTAMP NULL,
      registered_at TIMESTAMP NULL,
      verified_at TIMESTAMP NULL,
      password_change_at TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      created_by UUID NULL,
      updated_at TIMESTAMP NULL,
      updated_by UUID NULL,
      deleted_at TIMESTAMP NULL,
      deleted_by UUID NULL,
      CONSTRAINT fk_user_role_id FOREIGN KEY (role_id) REFERENCES master_roles(role_id) ON DELETE SET NULL
    );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE master_users`);
  }
}
