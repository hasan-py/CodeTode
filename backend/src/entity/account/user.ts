import { EUserRole, EUserStatus } from "@packages/definitions";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { CourseEnrollment } from "../course/courseEnrollment";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  githubId: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({
    type: "enum",
    enum: EUserRole,
    default: EUserRole.LEARNER,
  })
  role: EUserRole;

  @Column({
    type: "enum",
    enum: EUserStatus,
    default: EUserStatus.ACTIVE,
  })
  status: EUserStatus;

  @Column({ nullable: true })
  lastLogin: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => CourseEnrollment, (enrollment) => enrollment.user)
  courseEnrollments: CourseEnrollment[];
}
