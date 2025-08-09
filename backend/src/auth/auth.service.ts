import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';

import { UserService } from '../user/user.service';
import { LoginDto, LoginResponseDto, UserResponseDto } from './auth.dto';

@Injectable()
export class AuthService {
  private readonly SECRET = process.env.JWT_SECRET;
  private readonly REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    loginDto: LoginDto,
    response: Response,
  ): Promise<LoginResponseDto> {
    const { username, password } = loginDto;
    const user = await this.userService.findByUsername(username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new HttpException(
        'Invalid username or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!user.isActive) {
      throw new HttpException('Account is disabled', HttpStatus.UNAUTHORIZED);
    }

    const { id, firstName, lastName, role } = user;

    const accessToken = await this.jwtService.signAsync(
      { username, firstName, lastName, role },
      { subject: id, expiresIn: '15m', secret: this.SECRET },
    );

    const refreshToken = await this.jwtService.signAsync(
      { username, firstName, lastName, role },
      { subject: id, expiresIn: '1y', secret: this.REFRESH_SECRET },
    );

    await this.userService.setRefreshToken(id, refreshToken);

    response.cookie('refresh-token', refreshToken, { httpOnly: true });

    const userResponse: UserResponseDto = {
      id,
      username,
      firstName,
      lastName,
      role,
      isActive: user.isActive,
    };
    return { token: accessToken, user: userResponse };
  }

  async logout(request: Request, response: Response): Promise<boolean> {
    try {
      if (!request.user || !request.user['userId']) {
        throw new HttpException(
          'User not authenticated',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const userId = request.user['userId'];

      const user = await this.userService.findById(userId);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      await this.userService.setRefreshToken(userId, null);

      response.clearCookie('refresh-token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error during logout:', error);
      throw new HttpException(
        'Internal server error during logout',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async refresh(
    refreshToken: string,
    response: Response,
  ): Promise<LoginResponseDto> {
    if (!refreshToken) {
      throw new HttpException('Refresh token required', HttpStatus.BAD_REQUEST);
    }
    const decoded = this.jwtService.decode(refreshToken);
    const idSub = decoded['sub'] || null;

    if (!idSub) {
      throw new HttpException(
        'Refresh token is not valid',
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      const user = await this.userService.findById(idSub);
      const { firstName, lastName, username, id, role } = user;

      if (!(await bcrypt.compare(refreshToken, user.refreshToken))) {
        response.clearCookie('refresh-token');
        throw new HttpException(
          'Refresh token is not valid',
          HttpStatus.FORBIDDEN,
        );
      }

      await this.jwtService.verifyAsync(refreshToken, {
        secret: this.REFRESH_SECRET,
      });
      const accessToken = await this.jwtService.signAsync(
        { username, firstName, lastName, role },
        { subject: id, expiresIn: '15m', secret: this.SECRET },
      );

      const userResponse: UserResponseDto = {
        id,
        username,
        firstName,
        lastName,
        role,
        isActive: user.isActive,
      };
      return { token: accessToken, user: userResponse };
    } catch (error) {
      response.clearCookie('refresh-token');
      await this.userService.setRefreshToken(idSub, null);
      throw new HttpException(
        'Refresh token is not valid',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
