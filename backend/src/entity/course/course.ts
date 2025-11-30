import { ECourseStatus } from "@packages/definitions";
import { Module } from "./module";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { Chapter } from "./chapter";
import { Lesson } from "./lesson";
import { Quiz } from "./quiz";

@Entity()
@Unique(["lemonSqueezyProductId"])
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  lemonSqueezyProductId: string;

  @Column()
  enrollLink: string;

  @Column({
    type: "enum",
    enum: ECourseStatus,
    default: ECourseStatus.DRAFT,
  })
  status: ECourseStatus;

  @Column({ type: "int", default: 1 })
  validityYear: number;

  @Column({ default: "1.0.0" })
  version: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ type: "int" })
  position: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Module, (module) => module.course)
  modules: Module[];

  @OneToMany(() => Chapter, (chapter) => chapter.course)
  chapters: Chapter[];

  @OneToMany(() => Lesson, (lesson) => lesson.course)
  lessons: Lesson[];

  @OneToMany(() => Quiz, (quiz) => quiz.course)
  quizzes: Quiz[];
}
