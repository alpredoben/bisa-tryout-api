import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableTryoutDetailQuestions1748002773214 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE tryout_question_mapping (
      tryout_question_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      package_detail_id UUID NULL DEFAULT NULL,
      question_id UUID NULL DEFAULT NULL,
      order_number BIGINT DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      created_by UUID NULL,
      updated_at TIMESTAMP NULL,
      updated_by UUID NULL,
      deleted_at TIMESTAMP NULL,
      deleted_by UUID NULL,
      CONSTRAINT fk_tdq_package_detail_id FOREIGN KEY (package_detail_id) REFERENCES tryout_package_details(package_detail_id) ON DELETE SET NULL,
      CONSTRAINT fk_tdq_question_id FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE SET NULL
    );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE tryout_question_mapping`);
  }
}
