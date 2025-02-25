const userService = require("../services/userService.js");

// Get All Users API
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      message: "succesfully get all users data",
      data: {
        users,
      },
      code: 200,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "server internal error",
      code: 500,
    });
  }
};

// Get User By id API
exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);

    if(!user){
      return res.status(404).json({
        success:false,
        message:"User Not Found",
        code:404
      })
    }

    res.status(200).json({
      success: true,
      message: "Successfully Get User Data",
      data: {
        user,
      },
      code: 200,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: "User Not Found",
      code: 404,
    });
  }
};

// Update Users API
exports.updateUser = async (req, res) => {
  try {

    const user = await userService.updateUser(req.params.id, req.body);
    res.status(201).json({
      success: true,
      message: "successfully update user",
      data: {
        user,
      },
      code: 201,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: true,
      message: "User Not Found",
      code: 404,
    });
  }
};

// Created User API

exports.createUser = async (req, res) => {
  try {
    const { nama, username, password, role } = req.body;
    if (!nama || !username || !password) {
      return res.status(400).json({
        success: false,
        message: "all fields ( nama, username, password ) must be filled",
        code: 400,
      });
    }

    const user = await userService.createUser({
      nama,
      username,
      password,
      role,
    });

    // const existingUser = await prisma.tb_user.findUnique({
    //   where: { username: data.username },
    // });

    // if (existingUser) {
    //   return { success: false, message: "Username already in used" };
    // }


    return res.status(201).json({
      success: true,
      message: "succesfully created user",
      data: {
        user,
      },
      code: 201,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message,
      code: 500,
    });
  }
  
};

// Delete User API
exports.deleteUser = async (req, res) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    res.status(200).json({
      success: true,
      message: "User deleted",
      code: 200,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
