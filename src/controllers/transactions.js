import { dataBase } from "../database/bancodedados.js";
import { 
  findAccountIndex,
  formatBrazilianDateTime,
  registerDeposit,
  registercashOut, 
  registerTransfer,
  checkRequestData
} from "../util/util.js";

export const cashOut = (req, res) => {
  const { contas } = dataBase;
  const { numero_conta, valor } = req.body;
  const accountIndex = findAccountIndex(numero_conta);
  const cashOutData = {
    data: formatBrazilianDateTime(new Date()),
    numero_conta,
    valor
  }

  contas[accountIndex].saldo -= valor;
  registercashOut(cashOutData);
  return res.status(200).json({ mensagem: "Withdrawal successfully completed." });
}

export const executeDeposit = (req, res) => {
  const { contas } = dataBase;
  const { numero_conta, valor } = req.body;
  const accountIndex = findAccountIndex(numero_conta);
  const depositData = {
    data: formatBrazilianDateTime(new Date()),
    ...req.body
  }

  contas[accountIndex].saldo += Number(valor);
  registerDeposit(depositData);
  return res.status(200).json({ mensagem: "Deposit successfully completed." });
}

export const getBalance = (req, res) => {
  const { contas } = dataBase;
  const { numero_conta } = req.query;
  const accountIndex = findAccountIndex(numero_conta);

  return res.status(200).json({ saldo: contas[accountIndex].saldo });
}

export const executeTransfer = (req, res) => {
  const { contas } = dataBase;
  const { numero_conta_origem, numero_conta_destino, valor } = req.body;
  const sourceAccountIndex = findAccountIndex(numero_conta_origem);
  const destinationAccountIndex = findAccountIndex(numero_conta_destino);

  contas[sourceAccountIndex].saldo -= valor;
  contas[destinationAccountIndex].saldo += valor;

  const transferData = {
    data: formatBrazilianDateTime(new Date()),
    numero_conta_origem,
    numero_conta_destino,
    valor
  };

  registerTransfer(transferData);
  return res.status(200).json({ mensagem: "Transfer successfully completed." });
}

export const getExtract = (req, res) => {
  const { numero_conta } = checkRequestData(req);
  const { saques, depositos, transferencias } = dataBase;
  const bankStatement = {
    depositos: depositos.filter((saque) => saque["numero_conta"] == numero_conta),
    saques: saques.filter((saque) => saque["numero_conta"] == numero_conta),
    transferenciasEnviadas: transferencias.filter((saque) => saque["numero_conta_origem"] == numero_conta),
    transferenciasRecebidas: transferencias.filter((saque) => saque["numero_conta_destino"] == numero_conta)
  }

  return res.status(200).json(bankStatement);
}