import { isAdmin } from "../middlewares/admin.js";
import { validateCPF, validateEmail, isValidBirthDate, validateAccountID, validatePassword } from "../middlewares/validateAccount.js";
import { listAllAccounts, createAccount, updateAccount, deleteAccount } from "../controllers/account.js";
import { validateTransactionBalance, checkBalance, checkSourceAndDestinationAccounts } from "../middlewares/validateTransaction.js";
import { RequiredAccountProperties } from "../util/util.js";
import { executeDeposit, cashOut, getBalance, executeTransfer, getExtract } from "../controllers/transactions.js";
import { validateRequestData, validateRequiredProperties } from "../middlewares/requestData.js"
import express from "express";

const router = express.Router();

router.get("/contas", isAdmin, listAllAccounts);
router.post(
  "/contas",
  validateRequiredProperties(RequiredAccountProperties),
  validateRequestData,
  validateCPF,
  validateEmail,
  isValidBirthDate,
  createAccount
);
router.put(
  "/contas/:numeroConta/usuario",
  validateAccountID,
  validateRequestData,
  validateCPF,
  validateEmail,
  isValidBirthDate,
  updateAccount
);
router.delete("/contas/:numeroConta", validateAccountID, deleteAccount);
router.post(
  "/transacoes/depositar",
  validateAccountID,
  validateTransactionBalance,
  executeDeposit
);
router.post(
  "/transacoes/sacar",  
  validateAccountID,
  validatePassword,
  validateTransactionBalance,
  checkBalance,
  cashOut
);
router.post(
  "/transacoes/transferir",
  validateTransactionBalance,
  checkSourceAndDestinationAccounts,
  executeTransfer
);
router.get(
  "/contas/saldo",
  validateAccountID,
  validatePassword,
  getBalance
);
router.get(
  "/contas/extrato",
  validateAccountID,
  validatePassword,
  getExtract
)

export default router;

