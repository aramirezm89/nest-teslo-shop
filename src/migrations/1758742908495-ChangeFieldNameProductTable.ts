import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeFieldNameProductTable1758742908495
  implements MigrationInterface
{
  name = 'ChangeFieldNameProductTable1758742908495';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" RENAME COLUMN "name" TO "names"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" RENAME CONSTRAINT "UQ_22cc43e9a74d7498546e9a63e77" TO "UQ_13a6b9575ee4bd1bca77460f5fd"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" RENAME CONSTRAINT "UQ_13a6b9575ee4bd1bca77460f5fd" TO "UQ_22cc43e9a74d7498546e9a63e77"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" RENAME COLUMN "names" TO "name"`,
    );
  }
}
