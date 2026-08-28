"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async create(data) {
        return this.model.create(data);
    }
    async findById(id) {
        return this.model.findById(id);
    }
    async findOne(filter) {
        return this.model.findOne(filter);
    }
    async find(filter) {
        return this.model.find(filter);
    }
    async updateById(id, update) {
        return this.model.findByIdAndUpdate(id, update, { new: true });
    }
    async deleteById(id) {
        return this.model.findByIdAndDelete(id);
    }
}
exports.BaseRepository = BaseRepository;
