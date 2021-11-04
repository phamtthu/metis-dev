import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { ObjectId } from 'mongoose';
import { TaskResponse } from './task-response';
import * as moment from 'moment';
import { Moment } from 'moment';
import { prettierDate } from 'src/shared/helper';
import { LabelResponse } from 'src/label/response/label-response';
import { TaskGroupResponse } from 'src/task-group/response/task-group-response.dto';
import { UsersResponse } from 'src/user/response/response/users-response';
import { AttachmentResponse } from 'src/attachment/response/attachment-response';
import { UserResponse } from 'src/user/response/response/user-response';
import { TaskChecklistResponse } from 'src/task-checklist/response/task-checklist-response';

const getFirstLetters = (value: string) => {
  const split = value.split(' ');
  return split.map((e) => e[0].toUpperCase()).toString();
};

@Exclude()
class Attachment {
  @Expose()
  _id: ObjectId;

  @Expose()
  name: string;

  @Expose()
  @Transform(({ value }) => {
    return moment(value).startOf('minute').fromNow();
  })
  created_at: Moment;

  @Expose()
  size: string;

  @Expose()
  link: string;

  @Expose()
  download_link: string;
}

@Exclude()
class Comment {
  @Expose()
  _id: ObjectId;

  @Expose()
  @Type(() => UserResponse)
  created_by: UserResponse;

  @Expose()
  mention_users: string[];

  @Expose()
  content: string;

  @Expose()
  @Type(() => AttachmentResponse)
  attachments: AttachmentResponse;
}

@Exclude()
class UserAvatarName {
  @Expose()
  _id: ObjectId;

  @Expose()
  @Transform(({ value }) => getFirstLetters(value))
  name: string;

  @Expose()
  image: string;
}

@Exclude()
export class TaskDetailResponse extends TaskResponse {
  @Expose()
  @Transform(({ value }) => prettierDate(value))
  plan_start_date: Moment;

  @Expose()
  @Transform(({ value }) => {
    const year = new Date(value).getFullYear();
    const currentYear = new Date().getFullYear();
    if (year === currentYear) return moment(value).format(`MMM Do [at] h:mm a`);
    else return moment(value).format(`MMM Do YY [at] h:mm a`);
  })
  plan_end_date: Moment;

  @Expose()
  @Type(() => UsersResponse)
  created_by: UsersResponse;

  @Expose()
  @Type(() => LabelResponse)
  labes: LabelResponse[];

  @Expose()
  @Type(() => UserAvatarName)
  users: UserAvatarName[];

  @Expose()
  @Type(() => TaskGroupResponse)
  task_group: TaskGroupResponse;

  @Expose()
  @Type(() => Attachment)
  attachments: Attachment[];

  @Expose()
  @Type(() => Comment)
  comments: Comment[];

  @Expose()
  @Type(() => TaskChecklistResponse)
  task_checklists: TaskChecklistResponse[];

  @Expose()
  @Transform(({ value }) => {
    return moment(value).startOf('minute').fromNow();
  })
  created_at: Moment;

  @Expose()
  @Transform(({ value }) => {
    return moment(value).startOf('minute').fromNow();
  })
  updated_at: Moment;

  constructor(partial: Partial<TaskDetailResponse>) {
    super(partial);
    Object.assign(this, partial);
  }
}
