import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { CoreEntity } from "./core.entity";
import { UserEntity } from "./user.entity";

@Entity("todo")
export class TodoEntity extends CoreEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column({ type: "varchar", nullable: false })
  title: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ 
    type: "enum",
    enum: ["PENDING", "IN_PROGRESS", "COMPLETED"],
    default: "PENDING"
  })
  status: string;

  @Column({ name: "due_date", type: "timestamp", nullable: true })
  dueDate?: Date;

  @ManyToOne(() => UserEntity, user => user.todos)
  user: UserEntity;
}
