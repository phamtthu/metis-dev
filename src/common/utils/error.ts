import { HttpException, HttpStatus } from "@nestjs/common"

export const throwError = (error) => {
    throw new HttpException({
        status: error.status ?? HttpStatus.BAD_REQUEST,
        error: { message: error.message }
    }, error.status ?? HttpStatus.BAD_REQUEST)
}