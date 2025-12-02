import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Course } from "./course";
import { User } from "../account/ user";
import { EEnrollmentStatus } from "@packages/definitions";

@Entity()
export class CourseEnrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  courseId: number;

  @ManyToOne(() => Course)
  @JoinColumn({ name: "courseId" })
  course: Course;

  @Column({
    type: "enum",
    enum: EEnrollmentStatus,
    default: EEnrollmentStatus.ACTIVE,
  })
  status: EEnrollmentStatus;

  @Column({ type: "date", nullable: true })
  expiresAt: Date;

  @Column()
  invoiceLink: string;

  @Column()
  lemonSqueezyOrderId: number;

  @Column()
  lemonSqueezyCustomerId: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ nullable: true })
  paidUserName: string;

  @Column({ nullable: true })
  paidUserEmail: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
