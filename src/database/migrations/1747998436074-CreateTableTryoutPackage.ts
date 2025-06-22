import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableTryoutPackage1747998436074 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE tryout_packages (
      package_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      package_name VARCHAR(255) NOT NULL,
      category_id  UUID NULL DEFAULT NULL,
      stage_id  UUID NULL DEFAULT NULL,
      total_questions BIGINT DEFAULT NULL,
      order_number BIGINT DEFAULT NULL,
      mode_layout VARCHAR(100) NULL DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      created_by UUID NULL,
      updated_at TIMESTAMP NULL,
      updated_by UUID NULL,
      deleted_at TIMESTAMP NULL,
      deleted_by UUID NULL,
      CONSTRAINT fk_tryout_package_category_id FOREIGN KEY (category_id) 
      REFERENCES tryout_categories(category_id) ON DELETE SET NULL,
      CONSTRAINT fk_tryout_package_stage_id FOREIGN KEY (stage_id) 
      REFERENCES tryout_stages(stage_id) ON DELETE SET NULL
    )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE tryout_packages`);
  }
}
