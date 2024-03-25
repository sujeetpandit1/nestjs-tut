import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/jwt-strategy';
import { AuthService } from 'src/auth/auth-service';


@Module({
  imports:[TypeOrmModule.forFeature([User]), PassportModule, JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: process.env.JWT_EXPIRE },
  })],
  controllers: [UsersController],
  providers: [UsersService, AuthService, JwtStrategy],
  exports: [UsersService], 
})
export class UsersModule {}
