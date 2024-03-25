import { BadRequestException, Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { signIndataValidation } from 'src/validation/signin-data.validation';
import { Request } from 'express'; // Import Request


@Injectable()
export class UsersService {
  findOneByEmail(username: string) {
      throw new Error("Method not implemented.");
  }

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async signup(body: any) {

      const checkExist = await this.usersRepository.findOne({ where: { email: body.email } });
      if (checkExist) {
        throw new BadRequestException('Email already exists');
      }

      body.password = await bcrypt.hash(body.password, 10);
      const user: any = await this.usersRepository.save(this.usersRepository.create(body));
      // console.log(user.roles)
      delete user.password;
      return { data: user };

  }  

  async signin(body: signIndataValidation) {
    const userExist = await this.usersRepository.createQueryBuilder('user').addSelect('user.password').where('user.email = :email', { email: body.email }).getOne();
    if (!userExist) {
      throw new BadRequestException('Email does not exist');
    }

    const isMatch = await bcrypt.compare(body.password, userExist.password);
    if (!isMatch) {
      throw new BadRequestException('Password is incorrect');
    }

    return userExist
  }

  //get all users?
  async getAllUsers(request: Request){

    const user: any = request.user;
    // console.log(user.role);

    let users: any[];
    if(user.role === 'admin'){
      users = await this.usersRepository.find({ where: { roles: 'admin' } });
    } 
    else if(user.role === 'user'){
      users = await this.usersRepository.find({ where: { roles: 'user' } });
    } 
    else{
      users = await this.usersRepository.find();
    }

    if (users.length === 0) {
      throw new NotFoundException('No users found');
    }

    return users;
    }
    
  //get user by id
  async getUser(id: string){
    const data = await this.usersRepository.findOneBy({id: Number(id)});
    if(!data){
      throw new NotFoundException('User not found');
    }
    return data;
  } 



}
