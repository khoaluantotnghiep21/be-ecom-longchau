import { Body, Controller, Get, InternalServerErrorException, Post } from '@nestjs/common';
import { AppService } from './app.service';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  examplePost(@Body() body: any) {
    body.test = 32;
  }

  @Get('error')
  getError() {
    throw new InternalServerErrorException();
  }
}
