'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class document extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      document.belongsTo(models.user, {
        foreignKey: 'userId'
      })
      document.belongsTo(models.template, {
        foreignKey: 'templateId'
      })
      document.hasMany(models.section, { foreignKey: 'documentId', onDelete: 'CASCADE' })
      document.hasMany(models.version, { foreignKey: 'documentId', onDelete: 'CASCADE' })
      document.hasMany(models.share, { foreignKey: 'documentId', onDelete: 'CASCADE' })
      document.hasMany(models.application, { foreignKey: 'documentId' })
      document.hasMany(models.export, { foreignKey: 'documentId', onDelete: 'CASCADE' })
    }
  }
  document.init({
    title: DataTypes.STRING,
    type: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    templateId: DataTypes.INTEGER,
    authorName: DataTypes.STRING,
    authorEmail: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'document',
  });
  return document;
};