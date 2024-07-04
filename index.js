require("dotenv").config();
const conn = require("./db/conn");

const Cartao = require("./models/Cartao")
const Conquista = require("./models/Conquista")
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
app.get("/jogos/novo", (req, res) => {
    res.render(`formJogo`);
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

app.get("/jogos", async (req, res) => {
    const jogos = await Jogo.findAll({
        raw: true
    }) 
    res.render(`jogos`, {jogos});
});

app.post("/jogos/novo", async (req, res) => {
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
    const usuario = await Usuario.findByPk(id, {raw: true});
    res.render("formUsuario", {usuario})
})

app.get("/jogos/:id/atualizar", async (req, res) => {
    const id = req.params.id;
    const jogo = await Jogo.findByPk(id, {raw: true});
    res.render("formJogo", {jogo})
})

//atualizar user
app.post("/usuarios/:id/atualizar", async (req, res) => {
    const id = req.params.id;

    const dadosUsuario = {
        nickname: req.body.nickname,
        nome: req.body.nome
    }

    const registrosAfetados = await Usuario.update(dadosUsuario, {where: { id: id }})
    if (registrosAfetados > 0){
        res.redirect("/usuarios")
    }
    else {
        res.send("Erro ao atualizar o user!")
    }
})

//atualizar jogo
app.post("/jogos/:id/atualizar", async (req, res) => {
    const id = req.params.id;

    const dadosJogo= {
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        precoBase: req.body.precoBase
    }

    const registrosAfetados = await Jogo.update(dadosJogo, {where: { id: id }})
    if (registrosAfetados > 0){
        res.redirect("/jogos")
    }
    else {
        res.send("Erro ao atualizar o jogo!")
    }
})

//excluir user
app.post("/usuarios/excluir", async (req, res) => {
    const id = parseInt(req.body.id);

    const registrosAfetados = await Usuario.destroy ({where: { id: id }})
    if (registrosAfetados > 0){
        res.redirect("/usuarios")
    }
    else {
        res.send("Erro ao excluir o user!")
    }
})

//excluir jogo
app.post("/jogos/excluir", async (req, res) => {
    const id = parseInt(req.body.id);

    const registrosAfetados = await Jogo.destroy ({where: { id: id }})
    if (registrosAfetados > 0){
        res.redirect("/jogos")
    }   
    else {
        res.send("Erro ao excluir o jogo!")
    }
})

//rotas cartoes

//ver cartao
app.get("/usuarios/:id/cartoes", async (req, res) => {
    const id = parseInt(req.params.id);
    const usuario = await Usuario.findByPk(id, { include: ["Cartao"] });
    let cartoes = usuario.Cartao;
    cartoes = cartoes.map((cartao) => cartao.toJSON())
  
    res.render("cartoes", { usuario: usuario.toJSON(), cartoes });
  });

  //form cartao

  app.get("/usuarios/:id/novoCartao", async (req, res) => {
    const id = parseInt(req.params.id);
    const usuario = await Usuario.findByPk(id, { raw: true });
  
    res.render("formCartao", { usuario });
  });

  //cadastrar cartao

  app.post("/usuarios/:id/novoCartao", async (req, res) => {
    const id = parseInt(req.params.id);
  
    const dadosCartao = {
        numero: req.body.numero,
        nome: req.body.nome,
        codSeguranca: req.body.codSeguranca,
        UsuarioId: id,
    };
  
    await Cartao.create(dadosCartao);
  
    res.redirect(`/usuarios/${id}/cartoes`);
  });

  //rotas conquistas

  //ver conquistas
  app.get("/jogos/:id/conquistas", async (req, res) => {
    const id = parseInt(req.params.id);
    const jogo = await Jogo.findByPk(id, { include: ["Conquista"] });
    let conquistas = jogo.Conquista;
    conquistas = conquistas.map((conquista) => conquista.toJSON())
  
    res.render("conquistas", { jogo: jogo.toJSON(), conquistas });
  });

  //form conquistas
  app.get("/jogos/:id/novaConquista", async (req, res) => {
    const id = parseInt(req.params.id);
    const jogo = await Jogo.findByPk(id, { raw: true });
  
    res.render("formConquista", { jogo });
  });

//cadastro conquista
app.post("/jogos/:id/novaConquista", async (req, res) => {
    const id = parseInt(req.params.id);
  
    const dadosConquista = {
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      JogoId: id,
    };
  
    await Conquista.create(dadosConquista);
  
    res.redirect(`/jogos/${id}/conquistas`);
  });

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