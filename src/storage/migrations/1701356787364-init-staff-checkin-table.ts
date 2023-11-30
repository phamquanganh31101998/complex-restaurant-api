import { MigrationInterface, QueryRunner } from "typeorm";

export class InitStaffCheckinTable1701356787364 implements MigrationInterface {
    name = 'InitStaffCheckinTable1701356787364'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`staff_checkin\` (\`id\` int NOT NULL AUTO_INCREMENT, \`staff_id\` int NOT NULL, \`date\` varchar(10) NOT NULL, \`checkin_time\` varchar(8) NOT NULL, \`checkout_time\` varchar(8) NULL, INDEX \`idx_check_in_date\` (\`date\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`staff_checkin\` ADD CONSTRAINT \`FK_c07ac19c01b15152bf3aee8b7ac\` FOREIGN KEY (\`staff_id\`) REFERENCES \`staff\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`staff_checkin\` DROP FOREIGN KEY \`FK_c07ac19c01b15152bf3aee8b7ac\``);
        await queryRunner.query(`DROP INDEX \`idx_check_in_date\` ON \`staff_checkin\``);
        await queryRunner.query(`DROP TABLE \`staff_checkin\``);
    }

}
