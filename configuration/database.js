const { Sequelize, Model, DataTypes } = require('sequelize');
const config = require('./dbConfig.json');
// const sequelize = new Sequelize({dialect: 'sqlite', storage: './database.sqlite'});
const sequelize = new Sequelize("postgres://owprigxq:4RXcxlNUnJ1z7g59Sr-MfF-Mgnm6EL9a@queenie.db.elephantsql.com:5432/owprigxq");
//const sequelize = new Sequelize(config.database, config.username, config.password, {...config, logging: console.log});
//logging: process.env.NODE_ENV === 'production' ? false : console.log
class Quotation extends Model{}
class Slip extends Model{}
class Fixture extends Model {}

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

Fixture.init({
    game:{
        type: DataTypes.STRING,
        allowNull: false
    },
    league:{
        type: DataTypes.STRING,
        allowNull: false
    },
    adviceOdd:{
        type: DataTypes.STRING,
        allowNull: true
    },
    suggestion:{
        type: DataTypes.STRING,
        allowNull: true
    },    
    period:{
        type: DataTypes.STRING,
        allowNull: true
    },
    country:{
        type: DataTypes.STRING,
        allowNull: false
    },
    time:{
        type: DataTypes.STRING,
        allowNull: false
    },
    alarmSet:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    fixtureId:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {  sequelize });

//Quotation.hasMany(Slip, { foreignKey : "quotationId" });
Slip.belongsTo(Quotation, { foreignKey: 'quotationId'});
sequelize.sync({ alter: true })
module.exports = { Quotation, Slip, Fixture, Sequelizer : sequelize }