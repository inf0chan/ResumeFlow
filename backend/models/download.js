'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class download extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      download.belongsTo(models.user, {
        foreignKey: "userId",
      })
      download.belongsTo(models.document, {
        foreignKey: "documentId"
      })
    }
  }
  download.init({
    format: DataTypes.STRING,
    fileUrl: DataTypes.STRING,
    documentId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'export',
  });
  return download;
};