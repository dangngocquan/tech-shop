import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    // CREATE
    async create(user: User): Promise<User>  {
        return this.userRepository.save(user);
    }

    // GET
    async get(options: {}): Promise<User>{
        return this.userRepository.findOne({
            where: {
                ...options,
            },
            relations: ['shops']
        })
    }

    // UPDATE
    async update(userId: number, updateProperty: {}): Promise<User> {
        const userProperty = await this.userRepository.findOneBy({id : userId});
        return this.userRepository.save({
            ...userProperty,
            ...updateProperty
        });
    }

    async updatePassword(userId: number, password: string): Promise<User> {
        return this.update(userId, {password});
    }

    // DELETE
    async delete(userId: number): Promise<any> {
        return this.userRepository.delete(userId);
    }
}