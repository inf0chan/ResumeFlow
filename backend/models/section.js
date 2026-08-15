'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class section extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      section.belongsTo(models.document, {
        foreignKey: "documentId"
      })
      section.hasMany(models.item, { foreignKey: "sectionId", onDelete: "CASCADE" })
    }
  }
  section.init({
    heading: DataTypes.STRING,
    position: DataTypes.INTEGER,
    documentId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'section',
  });
  return section;
};