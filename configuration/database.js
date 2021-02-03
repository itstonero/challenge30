const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize({dialect: 'sqlite', storage: './database.sqlite'});

class Quotation extends Model{}
class Slip extends Model{}

Quotation.init(
{
    retryOdd:{
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    initOdd:{
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    growOdd:{
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    target:{
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    trial:{
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    odd:{
        type: DataTypes.DOUBLE,
        allowNull: false
    }
}, {  sequelize });

Slip.init({
    progressIndex:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    totalAmount:{
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    retryIndex:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    bonusAmount:{
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    usedOdd:{
        type: DataTypes.DOUBLE,
        allowNull: false
    }
}, { sequelize });

Quotation.hasMany(Slip, { foreignKey : "quotationId" });
Slip.belongsTo(Quotation, { foreignKey: 'quotationId'});


module.exports = { Quotation, Slip, Sequelizer : sequelize }