import { ECourseStatus, ELessonType } from "@packages/definitions";
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
import { Chapter } from "./chapter";
import { Course } from "./course";
import { Module } from "./module";
import { Quiz } from "./quiz";
import { LessonContentLink } from "./lessonContentLink";

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column()
  courseId: number;

  @ManyToOne(() => Course, (course) => course.lessons)
  @JoinColumn({ name: "courseId" })
  course: Course;

  @Column()
  moduleId: number;

  @ManyToOne(() => Module, (module) => module.lessons)
  @JoinColumn({ name: "moduleId" })
  module: Module;

  @Column()
  chapterId: number;

  @ManyToOne(() => Chapter, (chapter) => chapter.lessons)
  @JoinColumn({ name: "chapterId" })
  chapter: Chapter;

  @OneToMany(() => Quiz, (quiz) => quiz.lesson)
  quizzes: Quiz[];

  @OneToMany(() => LessonContentLink, (contentLink) => contentLink.lesson)
  contentLinks: LessonContentLink[];

  @Column({
    type: "enum",
    enum: ECourseStatus,
    default: ECourseStatus.DRAFT,
  })
  status: ECourseStatus;

  @Column({ type: "int" })
  position: number;

  @Column({ type: "int", default: 5 })
  xpPoints: number;

  @Column({
    type: "enum",
    enum: ELessonType,
  })
  type: ELessonType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
