'use strict';
module.exports = (sequelize, DataTypes) => {
  const Section = sequelize.define('Section', {
    section: DataTypes.STRING
  }, {});
  Section.associate = function(models) {
    // associations can be defined here
  };
  return Section;
};