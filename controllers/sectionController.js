const db = require('../models/index');
const sections = db.Section;

module.exports = {
  findAll: async (req, res, next) => {
    sections.findAll().then(result => res.json(result))  
  }
};