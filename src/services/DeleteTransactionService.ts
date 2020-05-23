import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';
import { getCustomRepository } from 'typeorm';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const findTransaction = await transactionsRepository.find({ id: id });

    if (!findTransaction) {
      throw new AppError('Transaction not found', 400);
    }

    const deleteTransaction = await transactionsRepository.delete({ id: id });
  }
}

export default DeleteTransactionService;
