import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { classToPlain } from 'class-transformer';
import { Model, PaginateModel } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { errorException } from 'src/common/utils/error';
import { Comment } from 'src/model/comment/comment-schema';
import { User } from 'src/model/user/user.shema';
import { toJsObject } from 'src/shared/helper';
import { AddCommentDto } from './dto/add-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentResponse } from './response/comment-response';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel('Comment')
    private commentModel: SoftDeleteModel<Comment> & PaginateModel<Comment>,
    @InjectModel('User')
    private userModel: Model<User>,
  ) {}

  async create(commentDto: AddCommentDto, userId: string) {
    try {
      const replaceResult = await this.replaceTagById(commentDto.content);
      commentDto.content = replaceResult.content;
      commentDto['mention_users'] = replaceResult.mentionUsers;
      const comment = await new this.commentModel({
        created_by: userId,
        ...commentDto,
      }).save();
      return classToPlain(new CommentResponse(toJsObject(comment)));
    } catch (error) {
      errorException(error);
    }
  }

  async update(commentId, commentDto: UpdateCommentDto, userId: string) {
    try {
      await this.checkUserRight(commentId, userId);
      if (commentDto.content) {
        const replaceResult = await this.replaceTagById(commentDto.content);
        commentDto.content = replaceResult.content;
        commentDto['mention_users'] = replaceResult.mentionUsers;
      }
      const newComment = await this.commentModel.findByIdAndUpdate(
        commentId,
        commentDto,
        { new: true },
      );
      return classToPlain(new CommentResponse(toJsObject(newComment)));
    } catch (error) {
      errorException(error);
    }
  }

  async replaceTagById(content: string) {
    try {
      let mentionUsers = [];
      const regex = new RegExp(/(@+[a-zA-Z0-9(_)]{1,})/g);
      const tags = content.match(regex);
      for await (const tag of tags) {
        const user = await this.userModel.findOne({ tag_name: tag.slice(1) });
        if (user) {
          mentionUsers.push(String(user._id));
          content = content.replace(tag, `@${user._id}`);
        }
      }
      return { content: content, mentionUsers: mentionUsers };
    } catch (error) {
      errorException(error);
    }
  }

  async softDelete(commentId: string, userId: string) {
    try {
      await this.checkUserRight(commentId, userId);
      const { n } = await this.commentModel.deleteById(commentId);
      if (n !== 1) throw new Error('Can not soft delete Comment');
    } catch (error) {
      errorException(error);
    }
  }

  async restore(commentId: string, userId: string) {
    try {
      let comment: any = await this.checkUserRight(commentId, userId);
      if (!comment.deleted)
        throw new BadRequestException('Comment is already restored');
      const { n } = await this.commentModel.restore({ _id: commentId });
      if (n !== 1) throw new Error('Can not restore Comment');
      comment = await this.commentModel.findById(commentId);
      return classToPlain(new CommentResponse(toJsObject(comment)));
    } catch (error) {
      errorException(error);
    }
  }

  async checkUserRight(commentId: string, userId: string) {
    try {
      const comment = await this.commentModel.findById(commentId).lean();
      if (!comment) throw new NotFoundException('Comment is not exist');
      if (String(comment.created_by) !== String(userId))
        throw new ForbiddenException(
          'You are not allow to modify this Comment',
        );
      return comment;
    } catch (error) {
      errorException(error);
    }
  }
}
