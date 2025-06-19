export interface ResponseUserDto {
  id: number;
  name: string;
  email: string;
  password?: string; // Optional for security reasons
  createdAt: Date;
}
