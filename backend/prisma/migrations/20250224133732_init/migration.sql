-- CreateTable
CREATE TABLE `tb_user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(100) NOT NULL,
    `username` VARCHAR(30) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('admin', 'kasir', 'member') NOT NULL,

    UNIQUE INDEX `tb_user_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_paket` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jenis` ENUM('kiloan', 'selimut', 'bed_cover', 'kaos', 'lain') NOT NULL,
    `nama_paket` VARCHAR(100) NOT NULL,
    `harga` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_member` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(100) NOT NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `jenis_kelamin` ENUM('L', 'P') NOT NULL,
    `tlp` VARCHAR(15) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_transaksi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kode_invoice` VARCHAR(100) NOT NULL,
    `id_member` INTEGER NOT NULL,
    `tgl` DATETIME(3) NOT NULL,
    `batas_waktu` DATETIME(3) NOT NULL,
    `tgl_bayar` DATETIME(3) NULL,
    `biaya_tambahan` INTEGER NOT NULL,
    `diskon` DOUBLE NOT NULL,
    `pajak` INTEGER NOT NULL,
    `status` ENUM('baru', 'proses', 'selesai', 'diambil') NOT NULL,
    `dibayar` ENUM('dibayar', 'belum_dibayar') NOT NULL,
    `id_user` INTEGER NOT NULL,

    UNIQUE INDEX `tb_transaksi_kode_invoice_key`(`kode_invoice`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_detail_transaksi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_transaksi` INTEGER NOT NULL,
    `id_paket` INTEGER NOT NULL,
    `qty` DOUBLE NOT NULL,
    `keterangan` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tb_transaksi` ADD CONSTRAINT `tb_transaksi_id_member_fkey` FOREIGN KEY (`id_member`) REFERENCES `tb_member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_transaksi` ADD CONSTRAINT `tb_transaksi_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `tb_user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_detail_transaksi` ADD CONSTRAINT `tb_detail_transaksi_id_transaksi_fkey` FOREIGN KEY (`id_transaksi`) REFERENCES `tb_transaksi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_detail_transaksi` ADD CONSTRAINT `tb_detail_transaksi_id_paket_fkey` FOREIGN KEY (`id_paket`) REFERENCES `tb_paket`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
