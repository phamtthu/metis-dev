export class CreateUserDto {
  readonly name: string;
  readonly phone: string;
  password: string;
  readonly user_type: number;
}