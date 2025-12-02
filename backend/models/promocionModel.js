/**
 * @fileoverview Sequelize model for the 'promocion' table.
 *
 * @version 1.0
 * @author Lunaria
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Categoria = require('./categoriaModel');
const Campaña = require('./campañaModel');

const Promocion = sequelize.define(
  'Promocion',
  {
    idPromocion: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(100),
      allowNull: false,
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
    idCampaña: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    tipoDescuento: {
      type: DataTypes.ENUM('Porcentaje', 'MontoFijo'),
      allowNull: false,
    },
    valorDescuento: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    montoMinimoCompra: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    idCategoriaAplicable: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: 'promocion',
    timestamps: false,
  }
);

Promocion.belongsTo(Campaña, { foreignKey: 'idCampaña' });
Promocion.belongsTo(Categoria, { foreignKey: 'idCategoriaAplicable' });

module.exports = Promocion;