const db = require("../models/index");
const site = db.Site;

module.exports = {
  findAll: async (req, res, next) => {
    const result = await site.findAll();
    res.json(result);
  },
  findById: async (req, res, next) => {
    const result = await site.findAll({
      where: {
        id: req.params.id
      }
    });
    res.json(result);
  },
  create: async (req, res, next) => {
    const result = await site.create(req.body);
    res.json(result);
  },
  update: async (req, res, next) => {
    const result = await site.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    res.json(result);
  },
  delete: async (req, res, next) => {
    const result = await site.destroy({
      where: {
        id: req.body.id
      }
    });
    res.json(result);
  }
};