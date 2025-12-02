/**
 * @fileoverview Modelo de datos para la tabla 'devolucion'.
 *
 * @version 1.0
 * @author Lunaria
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Pedido = require('./pedidoModel'); // Asumiendo que existe un modelo para Pedido

const Devolucion = sequelize.define('Devolucion', {
  idDevolucion: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  idPedido: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Pedido,
      key: 'idPedido',
    },
  },
  motivo: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  fechaSolicitud: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('solicitada', 'aceptada', 'rechazada', 'reembolsada'),
    allowNull: false,
  },
  montoReembolsado: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
}, {
  tableName: 'devolucion',
  timestamps: false,
});

Devolucion.belongsTo(Pedido, { foreignKey: 'idPedido' });

module.exports = Devolucion;
