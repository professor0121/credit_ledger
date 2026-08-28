import mongoose, { Model, Document } from "mongoose";

export abstract class BaseRepository<T extends Document> {
  protected constructor(protected readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  async findOne(filter: mongoose.QueryFilter<T>): Promise<T | null> {
    return this.model.findOne(filter);
  }

  async find(filter: mongoose.QueryFilter<T>): Promise<T[]> {
    return this.model.find(filter);
  }

  async updateById(id: string, update: mongoose.UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, update, { new: true });
  }

  async deleteById(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id);
  }
}
