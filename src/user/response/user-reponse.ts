import { ObjectId, } from 'mongodb';
import { Exclude, Transform, Expose } from 'class-transformer';
export class UserResponse {
    @Transform((value: any) => {
        if ('value' in value) {
            return value.value.toHexString();
        }
        return 'unknown value';
    })
    _id?: ObjectId;

    @Exclude()
    password: string

    @Exclude()
    __v: number

    @Exclude()
    regist_date: Date

    @Exclude()
    created_at: Date

    @Exclude()
    updated_at: Date

    @Transform((value: any) => {
        if ('value' in value) {
            const data = [];
            value.value.forEach(item => {
                if (item) {
                    data.push({ "name": item.name, "lat": item.lat, 'long': item.long, 'district': item.district, 'province': item.province });
                }

            });
            return data;
        }
        return 'unknown value';
    })
    locations: Array<any>

    @Exclude()
    change_code: string

    @Exclude()
    verify_code: string

    @Exclude()
    time_change_pass: Date

    @Exclude()
    tags: any

    constructor(partial: Partial<UserResponse>) {
        Object.assign(this, partial);
    }
}