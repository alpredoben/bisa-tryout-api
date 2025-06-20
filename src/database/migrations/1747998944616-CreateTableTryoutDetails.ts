import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableTryoutDetail1747998944616 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE tryout_details (
      detail_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      package_id  UUID NULL DEFAULT NULL,
      type_id  UUID NULL DEFAULT NULL,
      total_questions BIGINT DEFAULT NULL,
      total_duration BIGINT DEFAULT NULL,
      satuan_duration VARCHAR(100) DEFAULT NULL,
      order_number BIGINT DEFAULT NULL,
      passing_grade BIGINT DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      created_by UUID NULL,
      updated_at TIMESTAMP NULL,
      updated_by UUID NULL,
      deleted_at TIMESTAMP NULL,
      deleted_by UUID NULL,
      CONSTRAINT fk_tryout_detail_package_id FOREIGN KEY (package_id) 
      REFERENCES tryout_packages(package_id) ON DELETE SET NULL,
      CONSTRAINT fk_tryout_detail_type_id FOREIGN KEY (type_id) 
      REFERENCES tryout_types(type_id) ON DELETE SET NULL
    )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE tryout_details`);
  }
}
