import { ECourseStatus } from "@packages/definitions";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Course } from "./course";
import { Module } from "./module";
import { Lesson } from "./lesson";

@Entity()
export class Chapter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  moduleId: number;

  @ManyToOne(() => Module, (module) => module.chapters)
  @JoinColumn({ name: "moduleId" })
  module: Module;

  @Column()
  courseId: number;

  @ManyToOne(() => Course)
  @JoinColumn({ name: "courseId" })
  course: Course;

  @Column()
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({
    type: "enum",
    enum: ECourseStatus,
    default: ECourseStatus.DRAFT,
  })
  status: ECourseStatus;

  @Column({ type: "int" })
  position: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Lesson, (lesson) => lesson.chapter)
  lessons: Lesson[];
}
