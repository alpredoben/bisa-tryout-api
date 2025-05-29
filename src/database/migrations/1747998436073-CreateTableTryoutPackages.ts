import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableTryoutPackages1747998436073 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE tryout_packages (
      package_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      category_id  UUID NULL DEFAULT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT DEFAULT NULL,
      prices DECIMAL(20,2) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      created_by UUID NULL,
      updated_at TIMESTAMP NULL,
      updated_by UUID NULL,
      deleted_at TIMESTAMP NULL,
      deleted_by UUID NULL,
      CONSTRAINT fk_tryout_packages_category_id FOREIGN KEY (category_id) 
      REFERENCES tryout_categories(category_id) ON DELETE SET NULL
    )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE tryout_packages`);
  }
}
