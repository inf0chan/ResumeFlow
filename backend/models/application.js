'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class application extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      application.belongsTo(models.user, { foreignKey: 'userId'})
      application.belongsTo(models.document, { foreignKey: 'documentId'})
    }
  }
  application.init({
    company: DataTypes.STRING,
    role: DataTypes.STRING,
    status: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    documentId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'application',
  });
  return application;
};