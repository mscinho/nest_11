-- CreateTable
CREATE TABLE `person` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `city_id` INTEGER NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(125) NULL,
    `birth_date` DATETIME(3) NULL,
    `cpf` VARCHAR(11) NULL,
    `rg` VARCHAR(20) NULL,
    `telephone` VARCHAR(45) NULL,
    `international_phone` BOOLEAN NOT NULL DEFAULT false,
    `cep` VARCHAR(9) NULL,
    `logradouro` VARCHAR(255) NULL,
    `numero` VARCHAR(6) NULL,
    `neighborhood` VARCHAR(255) NULL,
    `complemento` VARCHAR(155) NULL,
    `picture` VARCHAR(255) NULL,
    `gender` CHAR(1) NULL,
    `device` VARCHAR(100) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `person_id` INTEGER NOT NULL,
    `home_screen` ENUM('schedule', 'patients') NOT NULL DEFAULT 'schedule',
    `is_master` BOOLEAN NULL,
    `username` VARCHAR(255) NOT NULL,
    `source_system` INTEGER NULL,
    `version_v1` VARCHAR(30) NULL,
    `version_v1_updated_at` DATETIME(3) NULL,
    `version_v2` VARCHAR(30) NULL,
    `version_v2_updated_at` DATETIME(3) NULL,
    `password` VARCHAR(2000) NOT NULL,
    `language` VARCHAR(6) NOT NULL DEFAULT 'en',
    `type` INTEGER NULL,
    `verification_code` VARCHAR(32) NULL,
    `verification_code_expires_at` DATETIME(3) NULL,
    `pwd_reset_token_hash` VARCHAR(255) NULL,
    `pwd_token_expires_at` DATETIME(3) NULL,
    `first_login` BOOLEAN NULL,
    `verify_importer` BOOLEAN NOT NULL DEFAULT false,
    `verified_at` DATETIME(3) NULL,
    `stamp` VARCHAR(2000) NULL,
    `registration_completed` BOOLEAN NOT NULL DEFAULT false,
    `treatment_pronoun` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `idx_username`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `person` ADD CONSTRAINT `person_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `city`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `person`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
