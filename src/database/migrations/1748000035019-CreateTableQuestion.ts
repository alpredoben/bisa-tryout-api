import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableQuestion1748000035019 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE questions (
      question_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      question_type_id UUID NULL DEFAULT NULL,
      type_question VARCHAR(255) DEFAULT 'text',
      question_value TEXT NULL DEFAULT NULL,
      question_point BIGINT DEFAULT NULL,
      question_time JSONB DEFAULT NULL,
      question_status BOOLEAN DEFAULT true,
      type_discussion VARCHAR(255) DEFAULT 'text',
      discussion_value TEXT NULL DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      created_by UUID NULL,
      updated_at TIMESTAMP NULL,
      updated_by UUID NULL,
      deleted_at TIMESTAMP NULL,
      deleted_by UUID NULL,
      CONSTRAINT fk_questions_question_type_id FOREIGN KEY (question_type_id) REFERENCES question_types(question_type_id) ON DELETE SET NULL
    );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE questions`);
  }
}
