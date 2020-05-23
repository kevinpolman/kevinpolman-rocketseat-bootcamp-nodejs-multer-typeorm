import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import { getCustomRepository } from 'typeorm';
import CategoryRepository from '../repositories/CategoryRepository';
import { TransactionBody } from '../routes/transactions.routes';

class CreateTransactionService {
  public async execute({
    category,
    type,
    title,
    value,
  }: TransactionBody): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getCustomRepository(CategoryRepository);

    const balance = await transactionsRepository.getBalance();

    if (type === 'outcome') {
      if (balance.total - value < 0) {
        throw new AppError(
          'Outcome is higher than income, operation denied.',
          400,
        );
      }
    }

    const searchCategory = await categoryRepository.findOne({
      where: { title: category },
    });
    let newCategory = searchCategory;

    if (!searchCategory) {
      const createNewCategory = await categoryRepository.create({
        title: category,
      });
      await categoryRepository.save(createNewCategory);
      newCategory = createNewCategory;
    }

    const createTransaction = await transactionsRepository.create({
      title,
      type,
      value,
      category: searchCategory ? searchCategory : newCategory,
      category_id: searchCategory ? searchCategory.id : newCategory?.id,
    });

    await transactionsRepository.save(createTransaction);

    return createTransaction;
  }
}

export default CreateTransactionService;
