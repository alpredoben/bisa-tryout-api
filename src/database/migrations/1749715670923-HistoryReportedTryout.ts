import { MigrationInterface, QueryRunner } from 'typeorm';

export class HistoryReportedTryout1749715670923 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE history_reported_tryout (
      history_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      history_status VARCHAR(50) DEFAULT NULL,
      history_type VARCHAR(100) DEFAULT NULL,
      history_request JSONB DEFAULT NULL,
      history_response JSONB DEFAULT NULL,
      history_description TEXT DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      created_by UUID NULL,
      updated_at TIMESTAMP NULL,
      updated_by UUID NULL,
      deleted_at TIMESTAMP NULL,
      deleted_by UUID NULL
    );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE history_reported_tryout`);
  }
}
