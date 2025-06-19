import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableQuestion1748000035019 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE questions (
      question_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      detail_id UUID NULL DEFAULT NULL,
      question_type VARCHAR(200) NULL DEFAULT 'text',
      question_value TEXT NULL DEFAULT NULL,
      question_file JSONB NULL DEFAULT NULL,
      question_status BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      created_by UUID NULL,
      updated_at TIMESTAMP NULL,
      updated_by UUID NULL,
      deleted_at TIMESTAMP NULL,
      deleted_by UUID NULL,
      CONSTRAINT fk_question_detail_id FOREIGN KEY (detail_id) REFERENCES tryout_details(detail_id) ON DELETE SET NULL
    );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE questions`);
  }
}
