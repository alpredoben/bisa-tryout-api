import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableAnswerQuestion1748001533230 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE question_answers (
      answer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      question_id UUID NULL DEFAULT NULL,
      type_answer VARCHAR(255) DEFAULT 'text',
      answer_value TEXT DEFAULT NULL,
      is_answer BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      created_by UUID NULL,
      updated_at TIMESTAMP NULL,
      updated_by UUID NULL,
      deleted_at TIMESTAMP NULL,
      deleted_by UUID NULL,
      CONSTRAINT fk_question_answers_question_id FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE SET NULL
    );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE question_answers`);
  }
}
