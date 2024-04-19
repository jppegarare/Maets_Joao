require("dotenv").config();
const conn = require("./db/conn");

conn
.authenticate()
.then(() => {
    console.log("Parabéns, você está conectado ao Banco de Dados!")
})
.catch((err) => {   
    console.log("Eita!!! Parece que ocorreu o seguinte erro: " + err)
})