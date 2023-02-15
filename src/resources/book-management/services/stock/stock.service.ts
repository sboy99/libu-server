import StockModel from './stock.model';
import StockVSchema from './stock.validation';

class StockService {
  private db = StockModel;
  private vSchema = new StockVSchema();
  private validateStockData = async (data: unknown) => {
    return await this.vSchema.upsertStock.parseAsync(data);
  };

  public upsertStock = async (data: unknown) => {
    const { bookId, ...stockData } = await this.validateStockData(data);
    const stock = await this.db.updateOne({ bookId }, stockData, {
      new: true,
      upsert: true,
      lean: true,
    });
    return stock;
  };
}

export default StockService;
