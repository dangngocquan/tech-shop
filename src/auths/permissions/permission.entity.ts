import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../roles/role.entity";
import { User } from "src/users/entity/user.entity";

@Entity('permission')
export class Permission {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({type: 'varchar', length: 255})
    name: string;

    @ManyToMany(() => Role)
    roles: Role[];

    @ManyToMany(() => User)
    users: User[];
}