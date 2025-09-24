import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductTable1758740620449 implements MigrationInterface {
    name = 'CreateProductTable1758740620449'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "description" text NOT NULL, "slug" text NOT NULL, "price" numeric NOT NULL, "stock" numeric NOT NULL, "brand" text NOT NULL, CONSTRAINT "UQ_22cc43e9a74d7498546e9a63e77" UNIQUE ("name"), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "product"`);
    }

}
