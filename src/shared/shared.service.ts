import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, PaginateModel } from "mongoose"
import { throwSrvErr } from "src/common/utils/error"
import { Customer } from "src/model/customer.schema"
import { Label } from "src/model/label.schema"
import { User } from "src/model/user.shema"
import { Order } from "src/model/order.schema"
import { PartCategory } from "src/model/partcategory.schema"
import { Position } from "src/model/position.schema"
import { Process } from "src/model/process.schema"
import { Product } from "src/model/product.schema"
import { ProductCategory } from "src/model/productcategory.schema"
import { ProductPart } from "src/model/productpart.schema"
import { Resource } from "src/model/resource.shema"
import { ResourceCategory } from "src/model/resource-category.schema"
import { Sequence } from "src/model/sequence.schema"
import { Skill } from "src/model/skill.schema"
import { Task } from "src/model/task.schema"
import { TaskStatus } from "src/model/taskstatuses.schema"
import { WorkCenter } from "src/model/workcenter.schema"

@Injectable()
export class SharedService {

    constructor(
        @InjectModel('User') private userModel: Model<User>,
        @InjectModel('Resource') private resourceModel: Model<Resource>,
        @InjectModel('Position') private positionModel: Model<Position>,
        @InjectModel('Skill') private skillModel: Model<Skill>,
        @InjectModel('Resource_Category') private rCategoryModel: Model<ResourceCategory>,
        @InjectModel('ProductCategory') private pCategoryModel: Model<ProductCategory>,
        @InjectModel('WorkCenter') private workCenterModel: Model<WorkCenter>,
        @InjectModel('Task') private taskModel: Model<Task>,
        @InjectModel('Product') private productModel: Model<Product>,
        @InjectModel('Order') private orderModel: Model<Order>,
        @InjectModel('Customer') private customerModel: Model<Customer>,
        @InjectModel('Label') private labelModel: Model<Label>,
        @InjectModel('Process') private processModel: Model<Process>,
        @InjectModel('Sequence') private sequenceModel: Model<Sequence>,
        @InjectModel('Task_Status') private taskStatusModel: Model<TaskStatus>,
        @InjectModel('Product_Part') private productPartModel: Model<ProductPart>,
        @InjectModel('Part_Category') private partCategoryModel: Model<PartCategory>
    ) { }

    async findSkillById(skillId: String) {
        try {
            return await this.skillModel.findById(skillId)
        } catch (error) { throwSrvErr(error) }
    }

    async findPositionById(positionId: String) {
        try {
            return await this.positionModel.findById(positionId)
        } catch (error) { throwSrvErr(error) }
    }

    async findRCategoryById(rCategoryId: String) {
        try {
            return await this.rCategoryModel.findById(rCategoryId)
        } catch (error) { throwSrvErr(error) }
    }

    async findPCategoryById(pCategoryId: String) {
        try {
            return await this.pCategoryModel.findById(pCategoryId)
        } catch (error) { throwSrvErr(error) }
    }

    async findResourceById(resourceId: string) {
        try {
            return await this.resourceModel.findById(resourceId)
        } catch (error) { throwSrvErr(error) }
    }

    async findWOrkCenterById(workCenterId: string) {
        try {
            return await this.workCenterModel.findById(workCenterId)
        } catch (error) { throwSrvErr(error) }
    }

    async findTaskById(taskId: string) {
        try {
            return await this.taskModel.findById(taskId)
        } catch (error) { throwSrvErr(error) }
    }

    async findProductById(productId: string) {
        try {
            return await this.productModel.findById(productId)
        } catch (error) { throwSrvErr(error) }
    }

    async findOrderById(orderId: string) {
        try {
            return await this.orderModel.findById(orderId)
        } catch (error) { throwSrvErr(error) }
    }

    async findCustomerById(customerId: string) {
        try {
            return await this.customerModel.findById(customerId)
        } catch (error) { throwSrvErr(error) }
    }

    async findLabelById(labelId: string) {
        try {
            return await this.labelModel.findById(labelId)
        } catch (error) { throwSrvErr(error) }
    }

    async findProcessById(processId: string) {
        try {
            return await this.processModel.findById(processId)
        } catch (error) { throwSrvErr(error) }
    }

    async findSequenceById(sequenceId: string) {
        try {
            return await this.sequenceModel.findById(sequenceId)
        } catch (error) { throwSrvErr(error) }
    }

    async findUserById(userId: string) {
        try {
            return await this.userModel.findById(userId)
        } catch (error) { throwSrvErr(error) }
    }

    async findTaskStatusById(taskStatusId: string) {
        try {
            return await this.taskStatusModel.findById(taskStatusId)
        } catch (error) { throwSrvErr(error) }
    }

    async findPartCategoryById(partCategoryId: string) {
        try {
            return await this.partCategoryModel.findById(partCategoryId)
        } catch (error) { throwSrvErr(error) }
    }

    async findProductPartById(productPartId: string) {
        try {
            return await this.productPartModel.findById(productPartId)
        } catch (error) { throwSrvErr(error) }
    }

}