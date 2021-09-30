import { PipeTransform, Injectable, ArgumentMetadata, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { SharedService } from '../shared.service';

@Injectable()
export class SkillID implements PipeTransform {

    constructor(
        private sharedService: SharedService
    ) { }

    async transform(skillId: any, metadata: ArgumentMetadata) {
        try {
            const result = await this.sharedService.findSkillById(skillId)
            if (!result)
                throw new NotFoundException('Skill is not exist')
            return skillId;
        } catch (error) {
            throw new HttpException({
                status: error.status ?? HttpStatus.BAD_REQUEST,
                error: { message: error.message }
            }, error.status ?? HttpStatus.BAD_REQUEST)
        }

    }
}