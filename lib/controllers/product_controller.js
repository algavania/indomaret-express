const Model = require("../models/product_model");
const Joi = require("joi");
const { buildResponse } = require("../utils/response_util");

const create = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    category: Joi.string().required(),
    stock: Joi.number().required(),
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    return res
      .status(400)
      .json(buildResponse(false, validation.error.message, null));
  } else {
    try {
      const data = req.body;
      const product = new Model(data);
      const savedProduct = await product.save();
      const populatedProduct = await Model.findById(savedProduct._id).populate('category');

      return res
        .status(200)
        .json(buildResponse(true, "Product created", populatedProduct));
    } catch (error) {
      return res.status(500).json(buildResponse(false, error.message, null));
    }
  }
};

const update = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    category: Joi.string().required(),
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    return res
      .status(400)
      .json(buildResponse(false, validation.error.message, null));
  } else {
    try {
      const data = req.body;
      const product = await Model.findOneAndUpdate(
        { _id: req.params.id },
        data,
        { new: true }
      );
      const populatedProduct = await Model.findById(product._id).populate('category');

      return res
        .status(200)
        .json(buildResponse(true, "Product updated", populatedProduct));
    } catch (error) {
      return res.status(500).json(buildResponse(false, error.message, null));
    }
  }
};

const remove = async (req, res) => {
  try {
    const product = await Model.findOneAndDelete({ _id: req.params.id });
    return res
      .status(200)
      .json(buildResponse(true, "Product deleted", product));
  } catch (error) {
    return res.status(500).json(buildResponse(false, error.message, null));
  }
};

const updateStock = async (req, res) => {
  const schema = Joi.object({
    stock: Joi.number().required(),
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    return res
      .status(400)
      .json(buildResponse(false, validation.error.message, null));
  } else {
    try {
      const data = req.body;
      const product = await Model.findOneAndUpdate(
        { _id: req.params.id },
        data,
        { new: true }
      );

      return res
        .status(200)
        .json(buildResponse(true, "Product stock updated", product));
    } catch (error) {
      return res.status(500).json(buildResponse(false, error.message, null));
    }
  }
};

const getAll = async (req, res) => {
  try {
    const products = await Model.find().populate("category");
    return res
      .status(200)
      .json(buildResponse(true, "Products found", products));
  } catch (error) {
    return res.status(500).json(buildResponse(false, error.message, null));
  }
};

const getById = async (req, res) => {
  try {
    const product = await Model.findById(req.params.id).populate("category");
    if (product) {
      return res
        .status(200)
        .json(buildResponse(true, "Product found", product));
    } else {
      return res
        .status(404)
        .json(buildResponse(false, "Product not found", null));
    }
  } catch (error) {
    return res.status(500).json(buildResponse(false, error.message, null));
  }
};

module.exports = { create, update, remove, updateStock, getAll, getById };