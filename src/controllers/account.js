import { dataBase } from "../database/bancodedados.js";
import { 
  generateAccountID, 
  formattedDate, 
  findAccountIndex, 
  checkZeroAccountBalance 
} from "../util/util.js";

export const listAllAccounts = (req, res) => {
  return res.status(200).json(dataBase.contas);
};

export const createAccount = (req, res) => {
  const JSONdata = req.body;
  
  const response = {
    numero: generateAccountID(),
    saldo: 0,
    usuario: {
      ...JSONdata,
      data_nascimento: formattedDate(JSONdata.data_nascimento)
    }
  }

  dataBase.contas.push(response);
  return res.status(201).json(response);
};

export const updateAccount = (req, res) => {
  const { numeroConta } = req.params;
  const JSONData = req.body;
  const accountIndex = findAccountIndex(numeroConta);
  const { contas } = dataBase;

  if(JSONData["data_nascimento"]){
    JSONData["data_nascimento"] = formattedDate(JSONData["data_nascimento"])
  }

  contas[accountIndex] = {
    ... contas[accountIndex],
    usuario: {
      ... contas[accountIndex].usuario,
      ... JSONData
    }
  }

  return res.status(200).json({ mensagem: "Account updated successfully" });
}

export const deleteAccount = (req, res) => {
  const { numeroConta } = req.params;
  const accountIndex = findAccountIndex(numeroConta);

  if(!checkZeroAccountBalance(numeroConta)){
    return res.status(403).json({ mensagem: "Account deletion was not possible." })
  }

  dataBase.contas.splice(accountIndex, 1);
  return res.status(200).json({ mensagem: "account deleted successfully" });
}