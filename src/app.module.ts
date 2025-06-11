import { MiddlewareConsumer, Module, NestModule, Scope } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestService } from './request.service';
import { AuthenticationMiddleware } from './middleware/authentication.middleware';
import { AuthGuard } from './guards/auth.guards';
import { LoggingInterceptor } from './interceptors/logging.interceptors';
import { FreezePipe } from './pipes/freeze.pipe';
import { HttpExceptionFilter } from './filters/http-exception.filters';
import { RolesGuard } from './guards/roles.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { SanPhamModule } from './Module/SanPham/product.module';
import { MediaModule } from './Module/Media/media.module';
import { DanhMucModule } from './Module/DanhMuc/category.module';
import { RoleModule } from './Module/Role/role.module';
import { databaseConfig } from './common/database/database.config';
import { IdentityUserModule } from './Module/IdentityUser/identityuser.module';
import { ThuongHieuModule } from './Module/ThuongHieu/thuonghieu.module';
import { JwtModule } from '@nestjs/jwt';
import { UnitModule } from './Module/DonViTinh/donvitinh.module';
import { UnitDetalsModule } from './Module/ChiTietDonViTinh/chitietdonvitinh.module';
import { PromotionModule } from './Module/ChuongTrinh/promotion.module';
import { LoaiModule } from './Module/Loai/loai.module';
import { IngredientModule } from './Module/ThanhPhan/ingredient.module';
import { UserRoleModule } from './Module/UserRole/userrole.module';
import { IngredientDetalsModule } from './Module/ChiTietThanhPhan/ingredientDetals.module';
import { VoucherModule } from './Module/Voucher/voucher.module';
import { PharmacyModule } from './Module/NhaThuoc/pharmacy.module';
import { PurchaseOrderModule } from './Module/DonHang/purchaseOrder.module';
import { OrderDetailModule } from './Module/ChiTietDonHang/orderDetail.module';
import { DeliveryModule } from './Module/GiaoHang/delivery.module';
import { PharmacyProductModule } from './Module/NhaThuoc_SanPham/pharmacy-product.module';
import { PharmacyEmployeesModule } from './Module/NhaThuoc_NhanVien/pharmacy-employees.module';
import { UserInfoModule } from './Module/UserInfo/userinfo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: databaseConfig,
      inject: [ConfigService],
    }),

    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
    }),
    // Thêm các module khác vào đây
    SanPhamModule,
    MediaModule,
    DanhMucModule,
    RoleModule,
    UserRoleModule,
    IdentityUserModule,
    ThuongHieuModule,
    UnitModule,
    UnitDetalsModule,
    PromotionModule,
    LoaiModule,
    IngredientModule,
    IngredientDetalsModule,    
    VoucherModule,
    PharmacyModule,    PurchaseOrderModule,
    OrderDetailModule,
    DeliveryModule,
    PharmacyProductModule,
    PharmacyEmployeesModule,
    PharmacyEmployeesModule
    DeliveryModule,
    UserInfoModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    RequestService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
    // {
    //   provide: 'APP_INTERCEPTOR',
    //   scope: Scope.REQUEST,
    //   useClass: LoggingInterceptor,
    // },
    {
      provide: 'APP_PIPE',
      useClass: FreezePipe,
    },
    {
      provide: 'APP_FILTER',
      useClass: HttpExceptionFilter,
    },
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('*');
  }
}
