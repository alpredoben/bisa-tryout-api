import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableTryoutPackageDetails1747998944616 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE tryout_package_details (
      package_detail_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      package_id  UUID NULL DEFAULT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT DEFAULT NULL,
      total_questions BIGINT DEFAULT NULL,
      total_duration JSONB DEFAULT NULL,
      order_number BIGINT DEFAULT NULL,
      passing_grade BIGINT DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      created_by UUID NULL,
      updated_at TIMESTAMP NULL,
      updated_by UUID NULL,
      deleted_at TIMESTAMP NULL,
      deleted_by UUID NULL,
      CONSTRAINT fk_tryout_package_details_package_id FOREIGN KEY (package_id) 
      REFERENCES tryout_packages(package_id) ON DELETE SET NULL
    )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE tryout_package_details`);
  }
}
