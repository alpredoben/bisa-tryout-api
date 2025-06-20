import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableTryoutCategory1747998041684 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE tryout_categories (
      category_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      organization_id  UUID NULL DEFAULT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT NULL DEFAULT NULL,
      year BIGINT DEFAULT NULL,
      prices DECIMAL(20,2) DEFAULT NULL,
      icon JSONB NULL DEFAULT NULL, 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      created_by UUID NULL,
      updated_at TIMESTAMP NULL,
      updated_by UUID NULL,
      deleted_at TIMESTAMP NULL,
      deleted_by UUID NULL,
      CONSTRAINT fk_tryout_category_organization_id FOREIGN KEY (organization_id) 
      REFERENCES organizations(organization_id) ON DELETE SET NULL
    )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE tryout_categories`);
  }
}
