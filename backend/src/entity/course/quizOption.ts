import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Quiz } from "./quiz";

@Entity()
export class QuizOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quizId: number;

  @ManyToOne(() => Quiz, (quiz) => quiz.options)
  @JoinColumn({ name: "quizId" })
  quiz: Quiz;

  @Column()
  text: string;

  @Column({ default: false })
  isCorrect: boolean;

  @Column({ type: "int" })
  position: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
