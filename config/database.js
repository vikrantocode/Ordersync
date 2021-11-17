const { Sequelize } = require('sequelize');

module.exports = new Sequelize('CEI','postgres','Buy#Sup&12N%3w',{
  host:'188.166.231.220',
  dialect: 'postgres',
  operatorsAliases:false,
  pool:{
      max:5,
      min:0,
      acquire:30000,
      idle:10000
  }
})

