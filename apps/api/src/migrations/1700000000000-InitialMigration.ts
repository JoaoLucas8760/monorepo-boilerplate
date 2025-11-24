import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class InitialMigration1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Habilitar extensão UUID
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Criar tabela roles
    await queryRunner.createTable(
      new Table({
        name: 'roles',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Criar tabela users
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Criar tabela de relacionamento user_roles
    await queryRunner.createTable(
      new Table({
        name: 'user_roles',
        columns: [
          {
            name: 'userId',
            type: 'uuid',
          },
          {
            name: 'roleId',
            type: 'uuid',
          },
        ],
      }),
      true,
    );

    // Criar índices
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USER_EMAIL',
        columnNames: ['email'],
      }),
    );

    await queryRunner.createIndex(
      'roles',
      new TableIndex({
        name: 'IDX_ROLE_NAME',
        columnNames: ['name'],
      }),
    );

    // Criar foreign keys
    await queryRunner.createForeignKey(
      'user_roles',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'user_roles',
      new TableForeignKey({
        columnNames: ['roleId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'roles',
        onDelete: 'CASCADE',
      }),
    );

    // Inserir roles padrão
    await queryRunner.query(`
      INSERT INTO roles (id, name, description, "createdAt", "updatedAt") VALUES
      ('00000000-0000-0000-0000-000000000001', 'admin', 'Administrador do sistema', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('00000000-0000-0000-0000-000000000002', 'user', 'Usuário comum', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_roles');
    await queryRunner.dropTable('users');
    await queryRunner.dropTable('roles');
  }
}

