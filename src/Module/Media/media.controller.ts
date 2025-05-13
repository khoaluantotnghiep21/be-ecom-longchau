import { Controller, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/Enum/role.enum';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UUID } from 'crypto';


@ApiBearerAuth('access-token')
@ApiTags('UploadFile')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Roles(Role.Admin, Role.Employee)
  @Post('upload/:idsanpham')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  async uploadMultiple(
    @Param('idsanpham') idsanpham: UUID,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.mediaService.uploadImages(files, idsanpham);
  }
    
    @Roles(Role.Admin)
    @Get('getAllMedia')
    findAll() {
        return this.mediaService.findAll();
    }

}
