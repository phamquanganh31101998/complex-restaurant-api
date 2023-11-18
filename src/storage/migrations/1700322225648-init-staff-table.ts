import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitStaffTable1700322225648 implements MigrationInterface {
  name = 'InitStaffTable1700322225648';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`staff\`
                             (
                                 \`id\`         int          NOT NULL AUTO_INCREMENT,
                                 \`name\`       varchar(255) NOT NULL,
                                 \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP (6),
                                 \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP (6) ON UPDATE CURRENT_TIMESTAMP (6),
                                 \`deleted_at\` datetime(6) NULL,
                                 PRIMARY KEY (\`id\`)
                             ) ENGINE=InnoDB`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`staff\``);
  }
}
