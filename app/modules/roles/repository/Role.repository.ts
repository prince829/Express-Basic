
import { AbstractClass } from "../../../helper/abstractClass/AbstractClass.repository.js";
import { RoleDocument, roleModel } from "../models/Role.model.js";

export class RoleRepository extends AbstractClass<RoleDocument>{
    constructor(){
        super(roleModel)
    };
    async getDistinctDocument(field:any, params:any):Promise<Array<RoleDocument>|null> {
        try {
            let record = await roleModel.distinct(field, params);
            if (!record) {
                return null;
            }
            return record;
        } catch (e) {
            throw e;
        }
    }
}