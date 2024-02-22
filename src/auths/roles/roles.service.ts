import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "./role.entity";
import { Repository } from "typeorm";

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private roleRepository: Repository<Role>
    ) {}

    async getPermissions(roleName: string): Promise<any> {
        return this.roleRepository.findOne({
            where: {
                name: roleName,
            },
            relations: ['permissions'],
        });
    }

    async get(options: {}): Promise<any> {
        return this.roleRepository.find({
            where: {
             ...options,
            },
            relations: ['permissions'],
        });
    }
}

