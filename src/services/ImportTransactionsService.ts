import Transaction from '../models/Transaction';
import { parseCSV } from '../config/csvParser';
import CreateTransactionService from './CreateTransactionService';
import { TransactionBody } from '../routes/transactions.routes';

class ImportTransactionsService {
  public async execute(filename: string): Promise<Transaction[]> {
    const parsedCSV = await parseCSV(filename);
    const createTransaction = new CreateTransactionService();
    const transactions: Transaction[] = [];

    for (let i = 0; i < parsedCSV.length; i++) {
      let transactionLine = parsedCSV[i];
      let [title, type, value, category] = transactionLine;

      const create = await createTransaction.execute({
        category,
        type,
        title,
        value,
      });

      transactions.push(create);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
