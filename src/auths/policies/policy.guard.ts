import { CanActivate, ExecutionContext, Inject, Injectable, forwardRef } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../auths/auths.decorator";
import { CHECK_POLICIES_KEY } from "./policy.decorator";
import { Request } from "express";
import { Policy } from "./policy.enum";
import { ShopsService } from "src/shops/shops.service";
import { ProductsService } from "src/products/products.service";

@Injectable()
export class PolicyGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private shopsService: ShopsService,
        private productsService: ProductsService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) return true;
        
        const policyNames = this.reflector.get<string[]>(
            CHECK_POLICIES_KEY,
            context.getHandler(),
        ) || [];

        const request = context.switchToHttp().getRequest();

        for (let policyName of policyNames) {
            if (!(await this.handlePolicy(request, policyName))) return false;
        }

        return true;
    }

    async handlePolicy(request: Request, policyName: string): Promise<boolean> {
        if (policyName === Policy.UpdateShop || policyName === Policy.DeleteShop) {
            const shops = await this.shopsService.get({
                id: request['params']['id'],
                ownerId: request['user']['id']
            })
            return shops.length > 0;
        }
        if (policyName === Policy.CreateProduct) {
            const shops = await this.shopsService.get({
                id: request['body']['shopId'],
                ownerId: request['user']['id']
            });
            return shops.length > 0;
        }
        if (policyName === Policy.UpdateProduct || policyName === Policy.DeleteProduct) {
            const products = await this.productsService.get({
                id: request['params']['id']
            });
            if (products.length === 0) return false;
            return products[0].shop.ownerId === request['user']['id'];
        }
        
    }
}