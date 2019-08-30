const db = require('../models/index');
const pages = db.Page;

module.exports = {
  findAll: async (req, res, next) => {
    pages.findAll().then(result => res.json(result))  
  }
};