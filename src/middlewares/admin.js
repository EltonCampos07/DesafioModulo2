import { dataBase }  from "../database/bancodedados.js"

export const isAdmin = (req, res, next) => {
  const { senha_banco } = req.query;
  const { senha } = dataBase.banco;

  if (senha_banco !== senha) {
    return res
      .status(401)
      .json({ mensagem: "a senha não foi informada ou é inválida" });
  }

  next();
};

