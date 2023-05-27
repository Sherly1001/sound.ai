import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitModelTypes1685181420327 implements MigrationInterface {
  private readonly initValues = ['AI Module', 'Edge Device', 'All'];

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `insert into model_type("typeName") values ${this.initValues
        .map((i) => `('${i}')`)
        .join(',')}`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `delete from model_type where "typeName" in (${this.initValues
        .map((i) => `'${i}'`)
        .join(',')})`,
    );
  }
}
