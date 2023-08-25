import dataBase from "../database/bancodedados.js";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/index.js";

//variável responsável por controlar qual número
//deve ser atribuido na hora da criação da conta
let numberAccount = 0;
export const RequiredAccountProperties = [
  "nome",
  "email",
  "cpf",
  "data_nascimento",
  "telefone",
  "senha",
];

export const isNotEmailUnique = (email) => {
  const { contas } = dataBase;
  return contas.find(({ usuario }) => usuario.email == email) ? true : false;
};

export const isNotCPFUnique = (cpf) => {
  const { contas } = dataBase;
  return contas.find(({ usuario }) => usuario.cpf == cpf) ? true : false;
};

export const generateAccountID = () => {
  numberAccount++;
  return numberAccount;
};

export const formattedDate = (date) => {
  return date?.split("/").reverse().join("/");
};

export const isValidDate = (date) => {
  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  return dateRegex.test(date);
};

export const isValidAccount = (numberAccount) => {
  return dataBase.contas.findIndex(
    (account) => account.numero == numberAccount) != -1
    ? true
    : false;
};

export const findAccountIndex = (numberAccount) => {
  return dataBase.contas.findIndex(
    (account) => account.numero == numberAccount
  );
};

export const formatBrazilianDateTime = (date) => {
  return format(date, "yyyy-MM-dd HH:mm:ss", { locale: ptBR });
};

export const isValidPassword = (password, numberAccount) => {
  const { contas } = dataBase;
  const accountIndex = findAccountIndex(numberAccount);
  const { senha } = contas[accountIndex].usuario;

  return senha == password;
};

export const checkAvailableBalance = (transactionAmount, numberAccount) => {
  const { contas } = dataBase;
  const accountIndex = findAccountIndex(numberAccount);
  const { saldo } = contas[accountIndex];

  return saldo >= transactionAmount;
};

export const checkZeroAccountBalance = (numberAccount) => {
  const { contas } = dataBase;
  const accountIndex = findAccountIndex(numberAccount);
  const { saldo } = contas[accountIndex];

  return saldo == 0
}

export const registerDeposit = (depositData) => {
  dataBase.depositos.push(depositData);
};

export const registercashOut = (cashOutData) => {
  dataBase.saques.push(cashOutData);
};

export const registerTransfer = (TransferData) => {
  dataBase.transferencias.push(TransferData);
};

export const checkRequestData = (request) => {
  
  if(Object.keys(request.body).length > 0){
    return request.body;
  }
  
  if(Object.keys(request.params).length > 0){
    return request.params;
  }

  return request.query;
  
}