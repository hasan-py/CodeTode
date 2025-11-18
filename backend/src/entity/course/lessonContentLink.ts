import { ELessonContentLinkType } from "@packages/definitions";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Lesson } from "./lesson";

@Entity()
export class LessonContentLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lessonId: number;

  @ManyToOne(() => Lesson, (lesson) => lesson.contentLinks)
  @JoinColumn({ name: "lessonId" })
  lesson: Lesson;

  @Column()
  url: string;

  @Column({ nullable: true })
  title: string;

  @Column({
    type: "enum",
    enum: ELessonContentLinkType,
  })
  linkType: ELessonContentLinkType;

  @Column({ type: "int" })
  position: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
