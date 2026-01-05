import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

type JwtPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      // 1) Extrae el token desde el header Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // 2) hace que tokens vencidos sean rechazados
      ignoreExpiration: false,

      // 3) Clave para verificar firma del token (debe ser la misma que usó para firmar)
      secretOrKey: config.get<string>('JWT_SECRET') || 'dev_secret_change_me',
    });
  }

  // 4) Si el token es válido, este método retorna el "usuario" que quedará disponible en req.user
  validate(payload: JwtPayload) {
    return { email: payload.email, sub: payload.sub };
  }
}
