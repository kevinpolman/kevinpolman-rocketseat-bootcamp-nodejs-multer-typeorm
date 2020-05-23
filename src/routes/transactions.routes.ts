import { Router } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import multer from 'multer';
import uploadConfig from '../config/upload';

export interface TransactionBody {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const getTransaction = new TransactionsRepository();
  const balance = await getTransaction.getBalance();
  const transactions = await getTransaction.getAllTransactions();

  const transactionObj = { transactions, balance };

  return response.json(transactionObj);
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category }: TransactionBody = request.body;

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.status(201).json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService();

  const deleteId = await deleteTransaction.execute(id);

  return response.status(204).json();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransaction = new ImportTransactionsService();

    const importToDB = await importTransaction.execute(request.file.filename);

    return response.json(importToDB);
  },
);

export default transactionsRouter;
