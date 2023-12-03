const Model = require("../models/user_model");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { buildResponse } = require("../utils/response_util");
const roleUtil = require("../utils/role_util");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    return res
      .status(400)
      .json(buildResponse(false, validation.error.message, null));
  } else {
    try {
      const data = req.body;
      data.role = roleUtil.EMPLOYEE;
      data.password = await bcrypt.hash(data.password, 10);
      const user = new Model(data);
      var savedUser = await user.save();
      savedUser = { ...savedUser.toObject() };
      delete savedUser.password;

      return res
        .status(200)
        .json(buildResponse(true, "User registered", savedUser));
    } catch (error) {
      return res.status(500).json(buildResponse(false, error.message, null));
    }
  }
};

const login = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    return res
      .status(400)
      .json(buildResponse(false, validation.error.message, null));
  } else {
    const data = req.body;
    var user = await Model.findOne({ email: data.email });
    if (user) {
      const passwordMatch = await bcrypt.compare(data.password, user.password);
      if (passwordMatch) {
        const token = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET
        );
        user = { ...user.toObject(), token };
        delete user.password;
        return res.status(200).json(buildResponse(true, "User logged in", user));
      }
    }
    return res
      .status(400)
      .json(buildResponse(false, "Invalid credentials", null));
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await Model.findById(req.params.id).select("-password");
    if (user) {
      return res
        .status(200)
        .json(buildResponse(true, "User found", user.toObject()));
    } else {
      return res.status(404).json(buildResponse(false, "User not found", null));
    }
  } catch (error) {
    return res.status(500).json(buildResponse(false, error.message, null));
  }
}

module.exports = { register, login, getUserById };
