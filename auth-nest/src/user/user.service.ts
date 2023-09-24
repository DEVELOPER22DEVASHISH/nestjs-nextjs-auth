import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/dto/user.dto';
import {hash} from 'bcrypt';

@Injectable()
export class UserService { // here will create a user function
    constructor(private prisma: PrismaService){} // to do that need to inject prisma service

    async create(dto:CreateUserDto){
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });

        if(user) throw new ConflictException('email duplicated'); // checking user existed

        const newUser = await this.prisma.user.create({
            data:{
                ...dto,
                password: await hash(dto.password,10)
            },
        });

        const { password, ...result} = newUser
        return result;
    } // for registering we need dto that take parameters

    
    async findByEmail(email: string){
        return await this.prisma.user.findUnique({
            where:{
                email: email,
                
            }
        })
    }
}
