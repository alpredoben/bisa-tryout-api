import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTablesRoleMenuSelection1747575529948 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE role_menu_selection (
      selection_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      role_id UUID NULL,
      menu_id UUID NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      created_by UUID NULL,
      updated_at TIMESTAMP NULL,
      updated_by UUID NULL,
      deleted_at TIMESTAMP NULL,
      deleted_by UUID NULL,
      CONSTRAINT fk_selection_role_id FOREIGN KEY (role_id) REFERENCES master_roles(role_id) ON DELETE CASCADE,
      CONSTRAINT fk_selection_menu_id FOREIGN KEY (menu_id) REFERENCES master_menu(menu_id) ON DELETE CASCADE
    )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE role_menu_selection`);
  }
}
