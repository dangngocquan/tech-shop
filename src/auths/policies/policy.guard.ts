import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../auths/auths.decorator";
import { IS_POLICY_KEY } from "./policy.decorator";
import { Policy } from "./policy.enum";
import { User } from "src/users/entity/user.entity";
import { Shop } from "src/shops/entity/shop.entity";
import { Action } from "./action.enum";

@Injectable()
export class PolicyGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        // private configService: ConfigService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) return true;
        
        const policyNames = this.reflector.getAllAndOverride<string[]>(IS_POLICY_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        const request = context.switchToHttp().getRequest();

        return policyNames.every((policyName) => {
            switch (policyName) {
                case Policy.CreateShop:
                    return request['user']['id'] == request['body']['ownerId'];
                default:
                    return true;
            }
        })
    }
    
}