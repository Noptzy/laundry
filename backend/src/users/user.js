const express = require("express");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const { PrismaClient, Role } = require("@prisma/client"); // Tambahkan Role Enum
const path = require("path");

const prisma = new PrismaClient();

// UPDATE USER
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    let updateData = {};

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
        code: 404,
      });
    }

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    if (req.file) {
      updateData.foto_profile = req.file.filename;
    }

    // 🔹 Validasi Role
    if (role) {
      if (!Object.values(Role).includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Role tidak valid. Gunakan: admin, kasir, atau member.",
          code: 400,
        });
      }
      updateData.role = role;
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: "User berhasil diperbarui",
      data: updatedUser,
      code: 200,
    });
  } catch (error) {
    console.error("Error saat update user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      code: 500,
    });
  }
};

//  CREATE USER
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Semua field (name, email, password) harus diisi.",
        code: 400,
      });
    }

    const userRole =
      role && Object.values(Role).includes(role) ? role : "member";

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: userRole,
      },
    });

    res.status(201).json({
      success: true,
      message: "User berhasil dibuat",
      data: user,
      code: 201,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      code: 500,
    });
  }
};

// GET ALL USERS
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({
      success: true,
      message: "Berhasil mendapatkan semua data user",
      data: users,
      code: 200,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server internal error",
      code: 500,
    });
  }
};

// GET USER BY ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id: Number(id) } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
        code: 404,
      });
    }

    res.status(200).json({
      success: true,
      message: "Berhasil mendapatkan data user",
      data: user,
      code: 200,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      code: 500,
    });
  }
};

// DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
        code: 404,
      });
    }

    await prisma.user.delete({ where: { id: Number(id) } });

    res.status(200).json({
      success: true,
      message: "User berhasil dihapus",
      code: 200,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server internal error",
      code: 500,
    });
  }
};
