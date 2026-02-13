import { Model, QueryFilter, UpdateQuery, Document, Types } from 'mongoose';


export abstract class BaseRepository<T extends Document> {
    constructor(protected readonly model: Model<T>) {}

    async create(doc: Partial<T>): Promise<T> {
        return this.model.create(doc);
    };

    async findOne(filter: QueryFilter<T>): Promise<T | null> {
        return this.model.findOne(filter).exec();
    };

    async findById(id: string | Types.ObjectId): Promise<T | null> {
        return this.model.findById(id).exec();
    };

    async findAll(
        filter: QueryFilter<T> = {},
        skip: number = 0,
        limit: number = 10,
        sort: Record<string, any> = { createAt: -1 },
    ): Promise<T[]> {
        return this.model
            .find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .exec();
    };

    async count(filter: QueryFilter<T> = {}): Promise<number> {
        return this.model.countDocuments(filter).exec();
    };

    async updateById(
        id: string | Types.ObjectId,
        update: UpdateQuery<T>,
    ): Promise<T | null> {
        return this.model
            .findByIdAndUpdate(id, update, { new: true })
            .exec();
    };

    async updateOne(
        filter: QueryFilter<T>,
        update: UpdateQuery<T>,
    ): Promise<T | null> {
        return this.model
            .findOneAndUpdate(filter, update, { new: true })
            .exec();
    };

    async deleteById(id: string | Types.ObjectId): Promise<T | null> {
        return this.model.findByIdAndDelete(id).exec();
    };

    async deleteMany(filter: QueryFilter<T>): Promise<any> {
        return this.model.deleteMany(filter).exec();
    };
};