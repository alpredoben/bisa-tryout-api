import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTableRoleMenu1747575529946 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'role_had_menus',
        columns: [
          {
            name: 'item_id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'role_id', type: 'uuid' },
          { name: 'menu_id', type: 'uuid' },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', isNullable: false },
          { name: 'created_by', type: 'uuid', isNullable: true },
          { name: 'updated_at', type: 'timestamp', isNullable: true },
          { name: 'updated_by', type: 'uuid', isNullable: true },
          { name: 'deleted_at', type: 'timestamp', isNullable: true },
          { name: 'deleted_by', type: 'uuid', isNullable: true },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'role_had_menus',
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['role_id'],
        referencedTableName: 'master_roles',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'role_had_menus',
      new TableForeignKey({
        columnNames: ['menu_id'],
        referencedColumnNames: ['menu_id'],
        referencedTableName: 'master_menu',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('role_had_menus');
  }
}
