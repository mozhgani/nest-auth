import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.jwt;  
        }
      ]),
      ignoreExpiration: false,
      secretOrKey: 'my secret',
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, name: payload.name };
  }
}
