import { Permission } from "src/auths/permissions/permission.entity";
import { Role } from "src/auths/roles/role.entity";
import { Shop } from "src/shops/entity/shop.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
export class User {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({type: 'varchar', length: 255})
    email: string;

    @Column({type: 'varchar', length: 255})
    password: string;

    @Column({type: 'varchar', length: 255})
    name: string;

    @OneToMany(() => Shop, (shop: Shop) => shop.owner)
    shops: Shop[];

    @ManyToMany(() => Role)
    @JoinTable({name: 'user_role'})
    roles: Role[];

    @ManyToMany(() => Permission)
    @JoinTable({name: 'user_permission'})
    nonstaticPermissions: Permission[];
}