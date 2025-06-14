import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTablesMenu1747574921814 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE master_menu (
      menu_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(255) NOT NULL,
      icon JSONB NULL DEFAULT NULL, 
      slug TEXT DEFAULT NULL,
      order_number BIGINT DEFAULT NULL,  
      parent_id UUID NULL,
      is_sidebar BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      created_by UUID NULL,
      updated_at TIMESTAMP NULL,
      updated_by UUID NULL,
      deleted_at TIMESTAMP NULL,
      deleted_by UUID NULL,
      CONSTRAINT fk_menu_parent_id FOREIGN KEY (parent_id) REFERENCES master_menu(menu_id) ON DELETE SET NULL
    );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE master_menu`);
  }
}
