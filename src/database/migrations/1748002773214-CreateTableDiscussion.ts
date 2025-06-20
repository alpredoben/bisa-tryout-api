import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableDiscussion1748002773214 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE discussions (
      discussion_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      question_id UUID NULL DEFAULT NULL,
      discussion_type VARCHAR(200) NULL DEFAULT 'text',
      discussion_value TEXT NULL DEFAULT NULL,
      discussion_file JSONB NULL DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      created_by UUID NULL,
      updated_at TIMESTAMP NULL,
      updated_by UUID NULL,
      deleted_at TIMESTAMP NULL,
      deleted_by UUID NULL,
      CONSTRAINT fk_discussion_question_id FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE SET NULL
    );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE discussions`);
  }
}
