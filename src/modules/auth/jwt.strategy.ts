import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "./schema/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";


//npm i passport-jwt

//will restrict user to login first before accessing any route
@Injectable()

export class JwtStrategy extends PassportStrategy(Strategy){
 constructor(
    @InjectModel(User.name)
private UserModel:Model<User>
 )
 {
super({
    jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),//exxtract token

    secretOrKey:process.env.JWT_SECRET_KEY
})    // invoke or run the passportstragety or parent class

 }   


async validate(payload){
    const {_id}=payload
    // console.log(_id,"Payload id")
    const user= await this.UserModel.findById(_id)
    if(!user){
        throw new UnauthorizedException('Login first to access')
    }
    return user
}


}