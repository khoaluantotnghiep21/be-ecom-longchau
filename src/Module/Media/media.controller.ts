import { Controller, Get, Param, Post, UploadedFiles, UseInterceptors, UploadedFile, Put, Delete, Body, Query } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/Enum/role.enum';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';
import { UUID } from 'crypto';
import { Public } from 'src/common/decorator/public.decorator';


@ApiBearerAuth('access-token')
@ApiTags('UploadFile')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Roles(Role.Admin, Role.Staff)
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
    
    @Public()
    @Get('getAllMedia')
    findAll() {
        return this.mediaService.findAll();
    }

    @Public()
    @Get('findMediaByProduct/:idsanpham')
    findMediaByProduct(@Param('idsanpham') idsanpham: UUID) {
        return this.mediaService.findByProductId(idsanpham);
    }

    @Roles(Role.Admin, Role.Staff)
    @Put('update/:mediaId')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiParam({ name: 'mediaId', description: 'ID của media cần cập nhật' })
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })
    async updateImage(
      @Param('mediaId') mediaId: string,
      @UploadedFile() file: Express.Multer.File,
    ) {
      // Kiểm tra file
      if (!file) {
        throw new Error('Không tìm thấy file ảnh');
      }
      return this.mediaService.updateProductImage(mediaId, file);
    }

    @Roles(Role.Admin, Role.Staff)
    @Delete('delete/:mediaId')
    @ApiParam({ name: 'mediaId', description: 'ID của media cần xóa' })
    async deleteImage(
      @Param('mediaId') mediaId: string,
    ) {
      return this.mediaService.deleteProductImage(mediaId);
    }
}
