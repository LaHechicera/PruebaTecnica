import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

type LoginDto = { email: string; password: string };

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // 1) Validación mínima: usuario fijo para la prueba
  private validateUser(email: string, password: string) {
    const validEmail = 'admin@test.com';
    const validPassword = '123456';

    if (email !== validEmail || password !== validPassword) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return { email: validEmail };
  }

  // 2) Login: valida y firma un token
  login(dto: LoginDto) {
    const user = this.validateUser(dto.email, dto.password);

    const payload = { sub: user.email, email: user.email };
    const access_token = this.jwtService.sign(payload);

    return { access_token, user };
  }
}
