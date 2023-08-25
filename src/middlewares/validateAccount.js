import {
  isNotCPFUnique,
  isNotEmailUnique,
  formattedDate,
  isValidDate,
  isValidAccount,
  isValidPassword,
  checkRequestData
} from "../util/util.js";

export const validateCPF = (req, res, next) => {
  const { cpf } = req.body;

  if (!cpf) next();

  if (isNotCPFUnique(cpf)) {
    return res
      .status(409)
      .json({ mensagem: "The provided CPF has already been used." });
  }

  next();
};

export const validateEmail = (req, res, next) => {
  const { email } = req.body;

  if (!email) next();

  if (isNotEmailUnique(email)) {
    return res
      .status(409)
      .json({ mensagem: "The provided email has already been used." });
  }

  next();
};

export const isValidBirthDate = (req, res, next) => {
  const { data_nascimento } = req.body;
  const parsedDate = new Date(formattedDate(data_nascimento));

  if(!data_nascimento){
    next();
  }

  if (isNaN(parsedDate) || !isValidDate(data_nascimento)) {
    return res
      .status(400)
      .json({ mensagem: "The provided birth date is invalid." });
  }

  next();
};

export const validateAccountID = (req, res, next) => {
  const { numeroConta } = req.params;
  const { numero_conta } = checkRequestData(req);

  if (!isValidAccount(numeroConta) && !isValidAccount(numero_conta)) {
    return res
      .status(404)
      .json({
        mensagem: `Account number ${numeroConta | numero_conta} was not found.`,
      });
  }

  next();
};

export const validatePassword = (req, res, next) => {
  const { senha, numero_conta } = checkRequestData(req);

  if (!isValidPassword(senha, numero_conta)) {
    return res.status(401).json({ mensagem: `Invalid password provided.` });
  }

  next();
};


