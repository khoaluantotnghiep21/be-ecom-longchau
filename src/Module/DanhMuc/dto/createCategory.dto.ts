import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  tendanhmuc: string;

  @ApiProperty()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  maloai: string;
}
