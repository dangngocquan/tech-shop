import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "./role.decorator";
import { RolesService } from "./roles.service";
import { UsersService } from "src/users/users.service";

@Injectable()
export class RoleGaurd implements CanActivate {
    constructor(
        private reflector: Reflector,
        private rolesService: RolesService,
        private usersService: UsersService,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Required permissions
        const requiredRoles = this.reflector.get<string[]>(
            ROLES_KEY,
            context.getHandler(),
        );
        const requiredPermissions = [];
        for (let role of requiredRoles) {
            const permissions = await this.rolesService.getPermissions(role);
            requiredPermissions.push(...permissions);
        }
        
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