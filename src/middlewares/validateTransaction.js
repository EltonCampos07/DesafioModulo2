import { checkAvailableBalance, isValidAccount, isValidPassword } from "../util/util.js";

export const validateTransactionBalance = (req, res, next) => {
  const { valor } = req.body;

  if (valor <= 0 || isNaN(valor)) {
    return res.status(422).json({ mensagem: "Invalid transaction amount" });
  }

  next();
};

export const checkBalance = (req, res, next) => {
  const { valor, numero_conta } = req.body;

  if (!checkAvailableBalance(valor, numero_conta)) {
    return res
      .status(402)
      .json({ mensagem: `Insufficient balance to complete transaction.` });
  }

  next();
};

export const checkSourceAndDestinationAccounts = (req, res, next) => {
  const { numero_conta_origem, numero_conta_destino, senha, valor } = req.body;

  if(!isValidAccount(numero_conta_origem)){
    return res.status(404).json({ mensagem: `Source account not found.` })
  }

  if(!isValidPassword(senha, numero_conta_origem)){
    return res.status(401).json({ mensagem: `Invalid password provided.` })
  }

  if(!isValidAccount(numero_conta_destino)){
    return res.status(404).json({ mensagem: `Destination account not found.` })
  }

  if(!checkAvailableBalance(valor, numero_conta_origem)){
    return res.status(402).json({ mensagem: `Insufficient balance to complete transaction.` });
  }

  if(numero_conta_origem === numero_conta_destino){
    return res
      .status(400)
      .json({ mensagem: `The transfer cannot be completed because the source and destination accounts are the same.` });
  }

  next();
}