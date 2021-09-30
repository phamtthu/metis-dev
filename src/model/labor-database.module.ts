import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { UserSchema } from "./user.shema"

@Module({
    imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
    exports: [MongooseModule]
})

export class UserDatabaseModule { }
