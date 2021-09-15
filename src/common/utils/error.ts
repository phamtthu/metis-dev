import { HttpException, HttpStatus } from "@nestjs/common"

export const throwCntrllrErr = (error) => {
    throw new HttpException({
        status: error.status ?? HttpStatus.BAD_REQUEST,
        error: {
            message: error.message
        }
    }, error.status ?? HttpStatus.BAD_REQUEST)
}

export const throwSrvErr = (error) => {
    throw new HttpException(
        error.message,
        error.status ?? HttpStatus.BAD_REQUEST
    )
}