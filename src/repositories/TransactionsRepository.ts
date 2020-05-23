import { EntityRepository, Repository, getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const findIncome = await transactionsRepository.find({
      where: { type: 'income' },
    });
    const findOutcome = await transactionsRepository.find({
      where: { type: 'outcome' },
    });

    return {
      income: findIncome.reduce((sum, transaction) => {
        return sum + transaction.value;
      }, 0),

      outcome: findOutcome.reduce((sum, transaction) => {
        return sum + transaction.value;
      }, 0),

      total:
        findIncome.reduce((sum, transaction) => {
          return sum + transaction.value;
        }, 0) -
        findOutcome.reduce((sum, transaction) => {
          return sum + transaction.value;
        }, 0),
    };
  }

  public async getAllTransactions(): Promise<Transaction[]> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    return await transactionsRepository.find();
  }
}

export default TransactionsRepository;
