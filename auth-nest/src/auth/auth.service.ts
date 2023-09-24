import { Injectable , UnauthorizedException} from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import { UserService } from 'src/user/user.service';

import {compare} from "bcrypt"
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private userService: UserService,
        private jwtService:JwtService){} // for injecting one service to others service

    async login(dto:LoginDto){

        const user = await this.validateUser(dto)


    }
  // need to check whether the user is available
    async validateUser(dto:LoginDto){

        const user = await this.userService.findByEmail(dto.username)

        const payload = {
            username:user.email,
            sub:{
                name:user.name
            }
        }


        if(user && (await compare(dto.password, user.password))){
            const {password, ...result} = user;
            return result;
        }

        throw new UnauthorizedException();

    }
}
