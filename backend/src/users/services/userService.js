const prisma = require("../models/usersModels.js");
const bcrypt = require("bcryptjs");

const getAllUsers = async () => {
  return await prisma.tb_user.findMany();
};

const getUserById = async (id) => {
  return await prisma.tb_user.findUnique({ where: { id: Number(id) } });
};

const createUser = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const userData = {
    nama: data.nama,
    username: data.username,
    password: hashedPassword,
    role: data.role ? data.role.toLowerCase() : "member",
  };

  if (!["admin", "kasir", "member"].includes(userData.role)) {
    throw new Error("Role harus salah satu dari: admin, kasir, atau member");
  }
  return await prisma.tb_user.create({ data: userData });
};

const updateUser = async (id, data) => {  

  const hashedPassword = await bcrypt.hash(data.password, 10);
  let userData = {
    ...data
  };
  if(data.password ){
    userData.password = await bcrypt.hash(data.password, 10)
  }
  return await prisma.tb_user.update({
    where: { id: Number(id) },
    data: userData,
  });
};

const deleteUser = async (id) => {
  return await prisma.tb_user.delete({ where: { id: Number(id) } });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
