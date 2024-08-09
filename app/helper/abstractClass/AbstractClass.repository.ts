import { Document, FilterQuery, Model, Types } from "mongoose";

export abstract class AbstractClass<ModelType extends Document>{
    protected modelName:Model<ModelType>
    constructor(model:Model<ModelType>){
        this.modelName=model
    };

    async save(data: Partial<ModelType>):Promise<ModelType>{
        try{
            return await this.modelName.create(data);
        }catch(err){
            throw err;
        }
    };
    async getById(id: string | Types.ObjectId): Promise<ModelType | null> {
        try {
            return await this.modelName.findById(id).exec();
        } catch (error) {
            throw error
        }
    };
    async updateById(data: Partial<ModelType>, id: Types.ObjectId| string): Promise<ModelType|null> {
        try {
            return await this.modelName.findByIdAndUpdate(id, data, {
                new: true,
                runValidators: true 
            });
        } catch (error) {
            throw error
        }
    };
    async getByField(params: FilterQuery<ModelType>): Promise<ModelType|null> {
        try {
            return await this.modelName.findOne(params).exec();
        } catch (error) {
            throw error;
        }
    };
    async bulkDelete(params:Array<string>):Promise<ModelType|any>{
        try{
            let arr=[];
            for(var i=0;i<params.length;i++){
                arr.push(new Types.ObjectId(params[i]))
            }
            return await this.modelName.updateMany({_id:{$in:arr}},{isDeleted: true})

        }catch(err){
            throw err;
        }
    }
}