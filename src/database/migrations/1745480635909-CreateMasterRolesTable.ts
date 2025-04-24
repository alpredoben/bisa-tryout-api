import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMasterRolesTable1745480635909 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE master_roles (
            role_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            role_name VARCHAR(255) NOT NULL,
            role_slug VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            created_by UUID NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
            updated_by UUID NULL DEFAULT NULL,
            deleted_at TIMESTAMP NULL,
            deleted_by UUID NULL DEFAULT NULL,
        );`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE roles`);
    }

}
