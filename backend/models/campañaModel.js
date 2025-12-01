/**
 * @fileoverview Modelo de datos para la tabla 'campaña'.
 *
 * @version 1.0
 * @author Lunaria
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Campaña = sequelize.define('Campaña', {
  idCampaña: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  titulo: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  imagen: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  fechaInicio: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  fechaFin: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'campaña',
  timestamps: false,
});

module.exports = Campaña;