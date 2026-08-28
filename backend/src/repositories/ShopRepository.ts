import { ShopModel, IShop } from "../models/Shop.model";
import { BaseRepository } from "./BaseRepository";

export class ShopRepository extends BaseRepository<IShop> {
  constructor() {
    super(ShopModel);
  }
}
