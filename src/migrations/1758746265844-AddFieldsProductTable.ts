import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFieldsProductTable1758745763743 implements MigrationInterface {
  name = 'AddFieldsProductTable1758745763743';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Elimina constraint de unique sobre name
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "UQ_22cc43e9a74d7498546e9a63e77"`,
    );

    // Renombra columna name a title para conservar datos
    await queryRunner.query(
      `ALTER TABLE "product" RENAME COLUMN "name" TO "title"`,
    );

    // Agrega nueva constraint de unique sobre title
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "UQ_f7bf944ad9f1034110e8c2133ab" UNIQUE ("title")`,
    );

    // Agrega nuevas columnas
    await queryRunner.query(
      `ALTER TABLE "product" ADD "sizes" text array NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "product" ADD "gender" text NOT NULL`);

    // Permite que description sea nullable
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "description" DROP NOT NULL`,
    );

    // Agrega constraint unique sobre slug
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "UQ_8cfaf4a1e80806d58e3dbe69224" UNIQUE ("slug")`,
    );

    // Establece valores por defecto
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "price" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "stock" SET DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Elimina defaults
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "stock" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "price" DROP DEFAULT`,
    );

    // Elimina constraint sobre slug
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "UQ_8cfaf4a1e80806d58e3dbe69224"`,
    );

    // Vuelve description a NOT NULL
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "description" SET NOT NULL`,
    );

    // Elimina nuevas columnas
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "gender"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "sizes"`);

    // Elimina constraint sobre title
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "UQ_f7bf944ad9f1034110e8c2133ab"`,
    );

    // Renombra columna title de vuelta a name
    await queryRunner.query(
      `ALTER TABLE "product" RENAME COLUMN "title" TO "name"`,
    );

    // Restaura constraint de unique sobre name
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "UQ_22cc43e9a74d7498546e9a63e77" UNIQUE ("name")`,
    );
  }
}
