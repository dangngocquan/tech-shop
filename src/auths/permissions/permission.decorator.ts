import { SetMetadata } from "@nestjs/common";

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissionNames: string[]) => SetMetadata(PERMISSIONS_KEY, permissionNames);