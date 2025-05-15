import { ApiProperty } from '@nestjs/swagger';

export class CreateLoaiDto {
  @ApiProperty()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  tenloai: string;
}
