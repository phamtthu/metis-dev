import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';

export const messageError = (error) => {
  throw new HttpException(
    {
      status: error.status ?? HttpStatus.BAD_REQUEST,
      error: {
        message: error.message,
      },
    },
    error.status ?? HttpStatus.BAD_REQUEST,
  );
};

export const errorException = (error) => {
  throw new HttpException(
    error.message,
    error.status ?? HttpStatus.BAD_REQUEST,
  );
};

export const throwCanNotDeleteErr = (target: string, related: string) => {
  throw new BadRequestException(
    `Can't delete ${target} right now. There are ${related}(s) link to this ${target}`,
  );
};
