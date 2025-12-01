const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Pago extends Model {}

Pago.init({
  idPago: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fechaPago: {
    type: DataTypes.DATE
  },
  monto: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  metodoPago: {
    type: DataTypes.STRING(50)
  },
  estadoTransaccion: {
    type: DataTypes.STRING(50)
  },
  stripe_payment_intent_id: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  idPedido: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    // Si tienes el modelo Pedido definido, puedes agregar la relación aquí
    // references: { model: 'Pedido', key: 'idPedido' }
  }
}, {
  sequelize,
  modelName: 'Pago',
  tableName: 'pago',
  timestamps: false
});

module.exports = Pago;