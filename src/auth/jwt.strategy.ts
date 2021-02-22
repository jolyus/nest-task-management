import { from } from "rxjs";
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from "./jwt-payload.interface";
import { UserRepository } from "./user.repository";
import { User } from "./user.entity";
import * as config from 'config';

const { secret } = config.get('jwt');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(UserRepository)
        private userRepository: UserRepository
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || secret,
        });
    }

    async validate(payload: JwtPayload): Promise<User> {
        const { username } = payload; 
        const user = await this.userRepository.findOne({ username });

        if(!user) throw new UnauthorizedException();

        return user;
    }
}