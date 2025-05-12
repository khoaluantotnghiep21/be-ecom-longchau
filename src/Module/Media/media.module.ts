import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Media } from './media.entity';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { SanPham } from '../SanPham/product.entity';
import { AuthGuard } from 'src/guards/auth.guards';

@Module({
  imports: [SequelizeModule.forFeature([Media, SanPham])],
  providers: [MediaService, AuthGuard],
  controllers: [MediaController],
})
export class MediaModule {}
