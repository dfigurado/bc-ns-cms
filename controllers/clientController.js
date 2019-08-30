const crypto = require("crypto");

const db = require("../models/index");
const block = db.Client;

module.exports = {
  findAll: async (req, res, next) => {
    block.findAll().then(result => res.json(result));
  },
  findById: async (req, res, next) => {
    const result = await block.findAndCountAll({
      where: {
        id: req.params.id
      },
      limit: 1
    });
    res.json(result);
  },
  findByHash: async (req, res, next) => {
    const result = await block.findAndCountAll({
      where: {
        hashCode: req.params.id
      },
      limit: 1
    });
    res.json(result);
  },
  create: async (req, res, next) => {
    req.body.hashCode = crypto.randomBytes(32).toString("hex");
    block.create(req.body).then(result => res.json(result));
  },
  update: async (req, res, next) => {
    block
      .update(req.body, {
        where: {
          id: req.params.id
        }
      })
      .then(result => res.json(result));
  },
  delete: async (req, res, next) => {
    const result = await block.destroy({
      where: {
        id: req.body.id
      }
    });
    res.json(result);
  }
};