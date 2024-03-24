const { Client } = require("pg");

const client = new Client({
    user: 'postgres',
    password: '3112',
    host: 'localhost',
    port: '5432',
    database: 'Maets'  
})

client .connect().then(() => {
        console.log("Conectando ao banco de dados")
    }).catch((err) =>{
        console.log("Errou aqui ó: " + err)
    });

function 