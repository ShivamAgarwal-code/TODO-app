import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CoreEntity } from "./core.entity";
import { TodoEntity } from "./todo.entity";

@Entity("user")
export class UserEntity extends CoreEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;
  @Column({ type: "varchar", nullable: true })
  username: string;
  @Column({ type: "varchar", nullable: false })
  email: string;
  @Column({ type: "varchar", nullable: false })
  password: string;
  @OneToMany(() => TodoEntity, todo => todo.user)
  todos: TodoEntity[];
}
