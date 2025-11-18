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
import { Lesson } from "./lesson";
import { QuizOption } from "./quizOption";

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  courseId: number;

  @ManyToOne(() => Course, (course) => course.modules)
  @JoinColumn({ name: "courseId" })
  course: Course;

  @Column()
  lessonId: number;

  @ManyToOne(() => Lesson, (lesson) => lesson.quizzes)
  @JoinColumn({ name: "lessonId" })
  lesson: Lesson;

  @OneToMany(() => QuizOption, (option) => option.quiz)
  options: QuizOption[];

  @Column()
  question: string;

  @Column({ type: "text", nullable: true })
  explanation: string;

  @Column({ type: "int" })
  position: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
