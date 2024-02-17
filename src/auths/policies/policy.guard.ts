import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../auths/auths.decorator";
import { IS_POLICY_KEY } from "./policy.decorator";
import { Policy } from "./policy.enum";
import { User } from "src/users/entity/user.entity";
import { Shop } from "src/shops/entity/shop.entity";
import { Action } from "./action.enum";
import { ShopsService } from "src/shops/shops.service";

@Injectable()
export class PolicyGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        // private configService: ConfigService,
        private shopsService: ShopsService,
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

        for (let policyName of policyNames) {
            if (policyName === Policy.UpdateShop || policyName === Policy.DeleteShop) {
                const existShops: Shop[] = await this.shopsService.get({
                    id: request['params']['id'],
                    ownerId: request['user']['id'],
                });
                if (existShops.length == 0) return false;
            }
        }
        return true;
    }
    
}