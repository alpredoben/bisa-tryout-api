import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMasterUsersTable1745480654152 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE history_import_transaction (
          history_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          execute_time TIMESTAMP NULL DEFAULT NULL,
          description TEXT NULL DEFAULT NULL,
          execute_status VARCHAR(255) DEFAULT 'on-process',
          execute_report JSONB DEFAULT NULL,
          file_name TEXT NULL DEFAULT NULL,
          path_file TEXT NULL DEFAULT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE history_import_transaction`);
  }
}
