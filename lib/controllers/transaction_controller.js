const Model = require("../models/transaction_model");
const Joi = require("joi");
const { buildResponse } = require("../utils/response_util");

const create = async (req, res) => {
  const schema = Joi.object({
    products: Joi.array().items(
      Joi.object({
        product: Joi.string().required(),
        quantity: Joi.number().required(),
      })
    ),
    totalPrice: Joi.number().required(),
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    return res
      .status(400)
      .json(buildResponse(false, validation.error.message, null));
  } else {
    try {
      const data = req.body;
      data.employee = req.user.id;
      console.log(data.employee);
      const transaction = new Model(data);
      const savedTransaction = await transaction.save();
      const populatedTransaction = await Model.findById(savedTransaction._id)
        .populate("products.product")
        .populate("employee");

      return res
        .status(200)
        .json(buildResponse(true, "Transaction created", populatedTransaction));
    } catch (error) {
      return res.status(500).json(buildResponse(false, error.message, null));
    }
  }
};

const update = async (req, res) => {
  const schema = Joi.object({
    products: Joi.array().items(
      Joi.object({
        product: Joi.string().required(),
        quantity: Joi.number().required(),
      })
    ),
    totalPrice: Joi.number().required(),
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    return res
      .status(400)
      .json(buildResponse(false, validation.error.message, null));
  } else {
    try {
      const data = req.body;
      const transaction = await Model.findOneAndUpdate(
        { _id: req.params.id },
        data,
        { new: true }
      );
      const populatedTransaction = await Model.findById(transaction._id)
        .populate("products.product")
        .populate("employee");

      return res
        .status(200)
        .json(buildResponse(true, "Transaction updated", populatedTransaction));
    } catch (error) {
      return res.status(500).json(buildResponse(false, error.message, null));
    }
  }
};

const remove = async (req, res) => {
  try {
    const transaction = await Model.findOneAndDelete({ _id: req.params.id });
    return res
      .status(200)
      .json(buildResponse(true, "Transaction deleted", transaction));
  } catch (error) {
    return res.status(500).json(buildResponse(false, error.message, null));
  }
};

const getAll = async (req, res) => {
  try {
    const transactions = await Model.find()
      .populate("products.product")
      .populate("employee");
    return res
      .status(200)
      .json(buildResponse(true, "Transactions retrieved", transactions));
  } catch (error) {
    return res.status(500).json(buildResponse(false, error.message, null));
  }
};

const getById = async (req, res) => {
  try {
    const transaction = await Model.findById(req.params.id)
      .populate("products.product")
      .populate("employee");
    return res
      .status(200)
      .json(buildResponse(true, "Transaction retrieved", transaction));
  } catch (error) {
    return res.status(500).json(buildResponse(false, error.message, null));
  }
};

module.exports = { create, update, remove, getAll, getById };
