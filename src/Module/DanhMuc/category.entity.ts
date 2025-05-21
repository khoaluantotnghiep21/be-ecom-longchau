import { BeforeSave, BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Loai } from '../Loai/loai.entity';
import { slugify } from 'src/common/Utils/slugify';

@Table({ tableName: 'danhmuc', timestamps: false })
export class DanhMuc extends Model {
  @PrimaryKey
  @Column
  madanhmuc: string;
  @Column
  tendanhmuc: string;
  @Column
  slug: string;
  @Column
  soluong: number;
  @Column
  @ForeignKey(() => Loai)
  maloai: string;
  @BelongsTo(() => Loai)
  loai: Loai;

  @BeforeSave
  static generateSlugIfNull(instance: DanhMuc) {
    if (!instance.slug && instance.tendanhmuc) {
      instance.slug = slugify(instance.tendanhmuc);
    }
  }
}
