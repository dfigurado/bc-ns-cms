const db = require("../models/index");
const block = db.Block;
const site = db.Site;
//var storehash = req.session.storehash;

module.exports = {
  findAll: async (req, res, next) => {
    const result = await block.findAll({
      include: [
        {
          model: site,
          attributes: ["store_hash"],
          where: { store_hash: storehash }
        }
      ]
    });
    const storehash = req.session.store_hash !== undefined
            ? req.session.store_hash
            : req.params.hash;
    try {
    } catch (error) {
      console.log(error);
    }

    res.json(result);
  },
  findById: async (req, res, next) => {
    const siteId = req.session.site_id;
    const result = await block.findAll({
      where: {
        id: req.params.id,
        site_id: siteId
      }
    });
    res.json(result);
  },
  create: async (req, res, next) => {
    const siteId = req.session.site_id;
    req.body.site_id = siteId;
    const result = await block.create(req.body);
    res.json(result);
  },
  update: async (req, res, next) => {
    const siteId = req.session.site_id;
    const result = await block.update(req.body, {
      where: {
        id: req.params.id,
        site_id: siteId
      }
    });
    res.json(result);
  },
  delete: async (req, res, next) => {
    const siteId = req.session.site_id;
    const result = await block.destroy({
      where: {
        id: req.body.id,
        site_id: siteId
      }
    });
    res.json(result);
  }
};