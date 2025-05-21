import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTablesFileStorages1747570376544 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE file_storages (
      file_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      file_name TEXT NULL DEFAULT NULL,
      file_desc TEXT NULL DEFAULT NULL,
      file_url TEXT NULL DEFAULT NULL,
      has_used BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      created_by UUID NULL,
      updated_at TIMESTAMP NULL,
      updated_by UUID NULL,
      deleted_at TIMESTAMP NULL,
      deleted_by UUID NULL
    );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE file_storages`);
  }
}
