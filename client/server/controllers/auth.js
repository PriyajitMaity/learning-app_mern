const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { userName, userEmail, password, role } = req.body;
  try {
    const existingUser = await User.findOne({
      $or: [{ userName }, { userEmail }],
    });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "User Name or Email already exists",
      });
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      userEmail,
      role,
      password: hashPassword,
    });
    const result =await newUser.save();
    res.status(201).json({
        status: 'success',
        message: "User registered successfully",
        data: {userName: result.userName, userEmail: result.userEmail, password: result.password},
    })
  } catch {
    return res.status(500).json({
      status: "error",
      message: "something went wrong",
    });
  }
};

const login = async (req, res) => {
  const { userEmail, password } = req.body;
    const user = await User.findOne({ userEmail });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: "false",
        message: "Invalid credentials!",
      });
    }

    const accessToken = jwt.sign(
      {
        _id: user.id,
        userName: user.userName,
        userEmail: user.userEmail,
        role: user.role,
      },
      "JWT_SECRET",{ expiresIn: "120m" }
    );
    res.status(200).json({
      success: "true",
      message: "Logged In Successfully",
      data: {
        accessToken,
        user: {
          _id: user.id,
          userName: user.userName,
          userEmail: user.userEmail,
          role: user.role,
        },
      },
    });
  
};

module.exports = { register, login };
