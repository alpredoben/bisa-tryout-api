import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableQuestionTypes1747999910479 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE question_types (
      question_type_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(255) NOT NULL,
      description TEXT DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      created_by UUID NULL,
      updated_at TIMESTAMP NULL,
      updated_by UUID NULL,
      deleted_at TIMESTAMP NULL,
      deleted_by UUID NULL
    );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE question_types`);
  }
}
