import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UsersService } from "src/users/users.service";
import { PERMISSIONS_KEY } from "./permission.decorator";

@Injectable()
export class RoleGaurd implements CanActivate {
    constructor(
        private reflector: Reflector,
        private usersService: UsersService,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Required permissions
        const requiredPermissions = this.reflector.get<string[]>(
            PERMISSIONS_KEY,
            context.getHandler(),
        );
        // User permissions
        const request = context.switchToHttp().getRequest();
        const userId = request['user']['id'];
        const userPermissions = await this.usersService.getPermissions(userId);
        // Check permissions
        for (const permission of requiredPermissions) {
            if (!userPermissions.includes(permission)) return false;
        }
        return true;
    } 
}