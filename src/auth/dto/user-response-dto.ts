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
    __v: string

    @Exclude()
    regist_date: string

    @Exclude()
    created_at: string

    @Exclude()
    updated_at: string

    @Exclude()
    change_code: string

    @Exclude()
    verify_code: string

    @Exclude()
    time_change_pass: string

    @Transform((value: any) => {
        if ('value' in value) {
            const data = [];
            value.value.forEach(item => {
                if (item) {
                    data.push({ "name": item.name, "lat": item.lat, 'long': item.long });
                }

            });
            return data;
        }
        return 'unknown value';
    })
    locations: Array<any>

    access_token: string

    constructor(partial: Partial<UserResponse>) {
        Object.assign(this, partial);
    }
}