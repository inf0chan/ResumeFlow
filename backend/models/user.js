'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs');


module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasMany(models.application, {
        foreignKey: "userId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      })
      user.hasMany(models.document, {
        foreignKey: "userId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      })
      user.hasMany(models.export, {
        foreignKey: "userId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      })
    }
  }
  user.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    photo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
    hooks: {
      beforeCreate: async (user, options) => {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  });
  return user;
};