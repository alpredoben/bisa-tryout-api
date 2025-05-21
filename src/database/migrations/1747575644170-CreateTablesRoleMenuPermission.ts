import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTablesRoleMenuPermission1747575644170 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE role_menu_permissions (
      permission_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      selection_id UUID NULL DEFAULT NULL,
      access_name VARCHAR(255) NULL DEFAULT NULL,  
      access_status BOOLEAN NULL DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      created_by UUID NULL,
      updated_at TIMESTAMP NULL,
      updated_by UUID NULL,
      deleted_at TIMESTAMP NULL,
      deleted_by UUID NULL,
      CONSTRAINT fk_permission_selection_id FOREIGN KEY (selection_id) 
          REFERENCES role_menu_selection(selection_id) ON DELETE SET NULL
    );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE role_menu_permissions`);
  }
}
