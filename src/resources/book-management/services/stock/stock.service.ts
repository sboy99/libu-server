import type { Types } from 'mongoose';
import StockModel from './stock.model';
import StockVSchema from './stock.validation';

class StockService {
  private db = StockModel;
  private vSchema = new StockVSchema();
  /**
   *
   * @param data unknown
   * @returns validated zod data
   */
  private validateStockData = async (data: unknown) => {
    return await this.vSchema.upsertStock.parseAsync(data);
  };
  /**
   *
   * @param bookId ObjectId
   * @returns initial stock
   */
  public resetStock = async (bookId: Types.ObjectId) => {
    const resetData = await this.validateStockData({});
    return await this.db
      .findOneAndUpdate({ bookId }, resetData, { new: true, lean: true })
      .select('-createdAt -updatedAt -isDeleted -__v');
  };
  /**
   *
   * @param bookId ObjectId
   * @param data unknown
   * @returns stock
   */
  public upsertStock = async (bookId: Types.ObjectId, data: unknown) => {
    const validStockData = await this.validateStockData(data);
    const stock = await this.db
      .findOneAndUpdate({ bookId, isDeleted: false }, validStockData, {
        upsert: true,
        new: true,
        lean: true,
      })
      .select('-createdAt -updatedAt -isDeleted -__v');

    return stock;
  };
}

export default StockService;
