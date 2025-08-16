const express = require("express");
const expressvalidator = require("express-validator");
const app = express();
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");
const path = require("path");
const Registro = require("./moldels/Registro-usuarios");
const bcrypt = require("bcrypt");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 8080;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine("handlebars", handlebars.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(express.static(path.join(__dirname, "public")));

const sequelize = new Sequelize("gerenciamento_proxyxpress", "root", "7599", {
  host: "localhost",
  dialect: "mysql",
});

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/cadastro", function (req, res) {
  res.render("registro");
});

app.post(
  "/cadastro",
  expressvalidator.body("Email").isEmail().normalizeEmail(),
  [
    expressvalidator
      .body("Nome")
      .notEmpty()
      .withMessage("O nome é obrigatório.")
      .isLength({ min: 3 })
      .withMessage("O nome precisa ter no mínimo 3 caracteres.")
      .escape(),
    expressvalidator
      .body("Sobrenome")
      .notEmpty()
      .withMessage("O sobrenome é obrigatório.")
      .escape(),
    expressvalidator
      .body("Email")
      .isEmail()
      .withMessage("Por favor, insira um e-mail válido.")
      .normalizeEmail()
      .escape(),
    expressvalidator
      .body("Senha")
      .isLength({ min: 8 })
      .withMessage("A senha precisa ter no mínimo 8 caracteres."),
    expressvalidator
      .body("DDI")
      .notEmpty()
      .withMessage("O DDI é obrigatório.")
      .escape(),
    expressvalidator
      .body("Telefone")
      .notEmpty()
      .withMessage("O telefone é obrigatório.")
      .escape(),
  ],
  async function (req, res) {
    const errors = expressvalidator.validationResult(req);
    if (!errors.isEmpty()) {
      res.send("renecie a pagina nao foi possivel fazer o cadastro");
      return;
    }
    const usuario_email = await Registro.findOne({
      where: { email: req.body.Email },
    });
    const usuario_telefone = await Registro.findOne({
      where: { telefone: req.body.Telefone },
    });
    
    if (!usuario_email && !usuario_telefone) { 

        const salt =  bcrypt.genSaltSync(10);
        const hash =  bcrypt.hashSync(req.body.Senha, salt);
      await Registro.create({
        nome: req.body.Nome,
        sobrenome: req.body.Sobrenome,
        email: req.body.Email,
        ddi: req.body.DDI,
        telefone: req.body.Telefone,
        senha: hash,
      });
    } else {
      return res.send("erro ao cadastrar");
    }

    return res.redirect("/login");
  }
);

app.get("/login", function (req, res) {
 return res.render("login");
});

app.post("/login", async function (req, res) {
  const { email, Senha } = req.body;
  const usuario = await Registro.findOne({ where: { email: email } });

  if (!usuario) {
    return res.status(401).send("Usuário não encontrado");
  }
  const senhaValida = bcrypt.compareSync(Senha, usuario.senha);
  if (!senhaValida) {
    return res.status(401).send("Senha inválida");
  }
  res.redirect("/sla");
});

app.listen(port, function () {
  console.log("servidor on");
});
