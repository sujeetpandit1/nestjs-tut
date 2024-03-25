import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { dataValidation } from 'src/validation/signup-data.validation';
import { signIndataValidation } from 'src/validation/signin-data.validation';
import * as jwt from 'jsonwebtoken';
import { User } from './entities/user.entity';
import { JwtAuthGuard, UserAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from '@nestjs/common';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  async signup(@Body() body: dataValidation) {
    // console.log(body);
    return await this.usersService.signup(body);
  }

  @Post('signin')
  async signin(@Body() body: signIndataValidation) {
    // console.log(body); 
    const user = await this.usersService.signin(body);
    delete user.password
    if (!user) {
      throw new BadRequestException('User not found');
    }
     
    // now perform jwt token generation
    const payload = { email: user.email, id: user.id, role:user.roles}; 
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });   

    return { message: 'Logged in successfully', data: token, user};
  }

  //Get All users
  @UseGuards(JwtAuthGuard)
  @Get('allUsers')
  async getAllUsers(@Request() request): Promise<User[]> {
    // console.log(UserAuthGuard);
    
     return await this.usersService.getAllUsers(request);
  }

  //Get user by id
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUser(@Param('id') id: string) {
    return await this.usersService.getUser(id);
  }

  
}
