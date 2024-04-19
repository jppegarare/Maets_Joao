const db = require("../db/conn")
const { DataTypes } = require("sequelize")

const Jogo = db.define("Jogo", {
    titulo: {
        type: DataTypes.STRING,
        required: true,
    },
    descricao: {
        type: DataTypes.INTEGER,
        required: true,
    },
    precoBase: {
        type: DataTypes.DOUBLE,
        required: true,
    },
    });

    module.exports = Jogo;