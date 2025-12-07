import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";

@Entity()
@Index(["userId", "courseId"])
@Unique(["userId", "lessonId"])
export class LearnerActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  userId: number;

  @Column()
  courseId: number;

  @Column()
  moduleId: number;

  @Column()
  chapterId: number;

  @Column()
  lessonId: number;

  @Column()
  xpEarned: number;

  @Column({ type: "date" })
  date: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
