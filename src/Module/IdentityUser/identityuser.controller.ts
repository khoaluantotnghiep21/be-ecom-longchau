import { Body, Controller, Post } from "@nestjs/common";
import { IdentityUserService } from "./identityuser.service";
import { Public } from "src/common/decorator/public.decorator";
import { SignInDto } from "./dto/signIn.dto";
import { CreateAccountDto } from "./dto/createAccount.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiBearerAuth('access-token')
@ApiTags('IdentityUser')
@Controller('identityuser')
export class IdentityUserController {
    constructor(
         private readonly identityUserService: IdentityUserService
    ) {}
    @Public()
    @Post('createAccount')
    async createAccount(@Body() createAccountDto: CreateAccountDto) {
        const newAccount = await this.identityUserService.createAccount(createAccountDto);
        return newAccount;
    }
    @Public()
    @Post('signIn')
    async signIn(@Body() signInDto: SignInDto) {
        const accessToken = await this.identityUserService.SignIn(signInDto);
        return accessToken;
    }
}