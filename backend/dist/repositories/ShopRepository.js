"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopRepository = void 0;
const Shop_model_1 = require("../models/Shop.model");
const BaseRepository_1 = require("./BaseRepository");
class ShopRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Shop_model_1.ShopModel);
    }
}
exports.ShopRepository = ShopRepository;
