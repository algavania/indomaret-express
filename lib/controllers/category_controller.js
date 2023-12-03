const Model = require("../models/category_model");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { buildResponse } = require("../utils/response_util");

const create = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    return res
      .status(400)
      .json(buildResponse(false, validation.error.message, null));
  } else {
    try {
      const data = req.body;
      const category = new Model(data);
      const savedCategory = await category.save();

      return res
        .status(200)
        .json(buildResponse(true, "Category created", savedCategory));
    } catch (error) {
      return res.status(500).json(buildResponse(false, error.message, null));
    }
  }
};

const update = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    return res
      .status(400)
      .json(buildResponse(false, validation.error.message, null));
  } else {
    try {
      const data = req.body;
      const category = await Model.findOneAndUpdate(
        { _id: req.params.id },
        data,
        { new: true }
      );

      return res
        .status(200)
        .json(buildResponse(true, "Category updated", category));
    } catch (error) {
      return res.status(500).json(buildResponse(false, error.message, null));
    }
  }
};

const remove = async (req, res) => {
  try {
    const category = await Model.findOneAndDelete({ _id: req.params.id });
    return res
      .status(200)
      .json(buildResponse(true, "Category deleted", category));
  } catch (error) {
    return res.status(500).json(buildResponse(false, error.message, null));
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Model.findOne({ _id: req.params.id });
    return res
      .status(200)
      .json(buildResponse(true, "Category fetched", category));
  } catch (error) {
    return res.status(500).json(buildResponse(false, error.message, null));
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Model.find();
    return res
      .status(200)
      .json(buildResponse(true, "Categories fetched", categories));
  } catch (error) {
    return res.status(500).json(buildResponse(false, error.message, null));
  }
};

module.exports = { create, update, remove, getCategoryById, getAllCategories };
