import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Loai } from './loai.entity';
import { LoaiService } from './loai.service';
import { LoaiController } from './loai.controller';

@Module({
  imports: [SequelizeModule.forFeature([Loai])],
  controllers: [LoaiController],
  providers: [LoaiService],
  exports: [LoaiService],
})
export class LoaiModule {}
