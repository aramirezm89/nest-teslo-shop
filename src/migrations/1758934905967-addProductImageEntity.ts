import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductImageEntity1758934905967 implements MigrationInterface {
    name = 'AddProductImageEntity1758934905967'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_image" ("id" SERIAL NOT NULL, "url" text NOT NULL, "productId" uuid, CONSTRAINT "PK_99d98a80f57857d51b5f63c8240" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product_image" ADD CONSTRAINT "FK_40ca0cd115ef1ff35351bed8da2" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_image" DROP CONSTRAINT "FK_40ca0cd115ef1ff35351bed8da2"`);
        await queryRunner.query(`DROP TABLE "product_image"`);
    }

}
