import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPasswordAndIsActiveToUsers1700000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adicionar coluna password
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'password',
        type: 'varchar',
        isNullable: false,
      }),
    );

    // Adicionar coluna isActive
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'isActive',
        type: 'boolean',
        default: true,
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'isActive');
    await queryRunner.dropColumn('users', 'password');
  }
}

