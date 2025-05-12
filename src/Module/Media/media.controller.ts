import { Controller, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/Enum/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@ApiTags('UploadFile')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

    @Roles(Role.Admin, Role.Employee)
    @Post('upload/:masanpham')
    @UseInterceptors(FilesInterceptor('files')) 
    async uploadMultiple(@Param('masanpham') masanpham: string, @UploadedFiles() files: Express.Multer.File[],) {
        return this.mediaService.uploadImages(files, masanpham);
    }
    
    @Roles(Role.Admin)
    @Get('getAllMedia')
    findAll() {
        return this.mediaService.findAll();
    }

}
