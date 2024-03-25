import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) { 
      throw new UnauthorizedException('No token provided');
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded;
      
      
      return true;
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw new UnauthorizedException('Token expired');
        } else {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
}

@Injectable()
export class AdminAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}
    
    canActivate(
        context: ExecutionContext,
        ): boolean | Promise<boolean> | Observable<boolean> {
            const request = context.switchToHttp().getRequest();
            const authHeader = request.headers.authorization;
            
            if (!authHeader) { 
                throw new UnauthorizedException('No token provided');
            }
            
            if (!authHeader.startsWith('Bearer ')) {
                throw new UnauthorizedException('Invalid token');
            }
            
            const token = authHeader.split(' ')[1];
            
            try {
                const decoded = this.jwtService.verify(token);
                request.user = decoded;
                if(decoded.roles != 'admin') throw new UnauthorizedException('You are not authorized');
                return true;
            } catch (err) {
        if (err.name === 'TokenExpiredError') {
          throw new UnauthorizedException('Token expired');
        } else {
          throw new UnauthorizedException('Invalid token');
        }
      }
    }
  }

@Injectable()
export class UserAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}
    
    canActivate(
        context: ExecutionContext,
        ): boolean | Promise<boolean> | Observable<boolean> {
            const request = context.switchToHttp().getRequest();
            const authHeader = request.headers.authorization;
            
            if (!authHeader) { 
                throw new UnauthorizedException('No token provided');
            }
            
            if (!authHeader.startsWith('Bearer ')) {
                throw new UnauthorizedException('Invalid token');
            }
            
            const token = authHeader.split(' ')[1];
            
            try {
                const decoded = this.jwtService.verify(token); 
                // console.log(decoded);
                if (decoded.role !== 'admin') {
                    throw new UnauthorizedException('You are not authorized');
                }
                               
                request.user = decoded;
                return true;
            } catch (err) {
                if (err.name === 'TokenExpiredError') {
                    throw new UnauthorizedException('Token expired');
                } else {
                    throw new UnauthorizedException('Invalid token');
                }
            }
      }
    }
  
