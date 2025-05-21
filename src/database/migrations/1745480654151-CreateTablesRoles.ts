import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTablesRoles1745480654151 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE master_roles (
      role_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      role_name VARCHAR(255) NOT NULL,
      role_slug VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      created_by UUID NULL,
      updated_at TIMESTAMP NULL,
      updated_by UUID NULL,
      deleted_at TIMESTAMP NULL,
      deleted_by UUID NULL
  );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE master_roles`);
  }
}
