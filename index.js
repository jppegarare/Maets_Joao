require("dotenv").config();
const conn = require("./db/conn");

const Usuario = require("./models/Usuario")
const Jogo = require("./models/Jogo")
const handlebars = require("express-handlebars")
const express = require("express");
const app = express();

app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")

app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json())

app.get("/usuarios/novo", (req, res) => {
    res.render(`formUsuario`);
});

app.get("/", (req, res) => {
    res.render(`home`);
});

app.get("/usuarios", async (req, res) => {
    const usuarios = await Usuario.findAll({
        raw: true
    }) 
    res.render(`usuarios`, {usuarios});
});

app.post("/usuarios/novo", async (req, res) => {
    const nickname = req.body.nickname;
    const nome = req.body.nome;



    const dadosUsuario = {
        nickname,
        nome,
    };

    const usuario = await Usuario.create(dadosUsuario)

    res.send("Usuario inserido sob o id " + usuario.id)
});



app.get("/jogo/novo", (req, res) => {
    res.sendFile(`${__dirname}/views/formJogo.html`);
});

app.post("/jogo/novo", async (req, res) => {
    const titulo = req.body.titulo;
    const descricao = req.body.descricao;
    const precoBase = req.body.precoBase;

    const dadosJogo = {
        titulo,
        descricao,
        precoBase,
    };

    const jogo = await Jogo.create(dadosJogo)

    res.send("Jogo inserido sob o id " + jogo.id)
});

app.get("/usuarios/:id/atualizar", async (req, res) => {
    const id = req.params.id;
    const usuario = Usuario.findByPk(id, {raw: true});
    res.render("formUsuario", {usuario})
})

app.listen(8000, () =>{
    console.log("Server rodanddo na porta 8000")
})


conn
.sync()
.then(() => {
    console.log("Parabéns, você está conectado ao Banco de Dados e com a estrutura sincronizada!")
})
.catch((err) => {   
    console.log("Erro ao conectar/sincronizar: " + err)
})