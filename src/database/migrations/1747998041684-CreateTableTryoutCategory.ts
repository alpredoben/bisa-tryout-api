import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableTryoutCategory1747998041684 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE tryout_categories (
      category_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(255) NOT NULL,
      description TEXT DEFAULT NULL,
      icon TEXT DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      created_by UUID NULL,
      updated_at TIMESTAMP NULL,
      updated_by UUID NULL,
      deleted_at TIMESTAMP NULL,
      deleted_by UUID NULL
    )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE tryout_categories`);
  }
}
