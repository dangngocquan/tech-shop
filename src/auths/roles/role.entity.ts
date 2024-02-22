import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Permission } from "../permissions/permission.entity";
import { User } from "src/users/entity/user.entity";

@Entity('role')
export class Role {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({type: 'varchar', length: 255})
    name: string;

    @ManyToMany(() => User)
    users: User[];

    @ManyToMany(() => Permission)
    @JoinTable({name: 'role_permission'})
    permissions: Permission[];
}