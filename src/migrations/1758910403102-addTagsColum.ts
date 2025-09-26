import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTagsColum1758910403102 implements MigrationInterface {
  name = 'AddTagsColum1758910403102';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" ADD "tags" text array NOT NULL DEFAULT '{}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "tags"`);
  }
}
