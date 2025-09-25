import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductTable1758757591237 implements MigrationInterface {
    name = 'UpdateProductTable1758757591237'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "brand"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "brand" text NOT NULL`);
    }

}
