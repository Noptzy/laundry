-- AlterTable
ALTER TABLE `tb_user` MODIFY `role` ENUM('admin', 'kasir', 'member') NOT NULL DEFAULT 'member';
