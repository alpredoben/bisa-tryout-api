import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTableAccessPermission1747575529947 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'access_permissions',
        columns: [
          {
            name: 'access_id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'item_id', type: 'uuid' },
          { name: 'permission_id', type: 'uuid' },
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
      'access_permissions',
      new TableForeignKey({
        columnNames: ['item_id'],
        referencedColumnNames: ['item_id'],
        referencedTableName: 'role_had_menus',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'access_permissions',
      new TableForeignKey({
        columnNames: ['permission_id'],
        referencedColumnNames: ['permission_id'],
        referencedTableName: 'master_permissions',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('access_permissions');
  }
}
