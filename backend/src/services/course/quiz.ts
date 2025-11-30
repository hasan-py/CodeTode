import { Quiz } from "../../entity/course/quiz";
import { QuizOption } from "../../entity/course/quizOption";
import { QuizOptionRepository, QuizRepository } from "../../repository";
import { BaseService } from "../common/base";

export class QuizService extends BaseService<Quiz> {
  private QuizOptionRepository = QuizOptionRepository;

  constructor() {
    super(QuizRepository);
  }

  async createQuiz(
    quizData: Partial<Quiz>,
    options: Partial<QuizOption>[]
  ): Promise<Quiz> {
    return this.runInTransaction(async (transactionalEntityManager) => {
      if (quizData.lessonId) {
        const existingQuiz = await transactionalEntityManager
          .createQueryBuilder(Quiz, "quiz")
          .where("quiz.lessonId = :lessonId", { lessonId: quizData.lessonId })
          .getOne();
        if (existingQuiz) {
          throw new Error(
            "A quiz already exists for this lesson. Only one quiz per lesson is allowed."
          );
        }
      }

      let position = quizData.position;
      if (position === undefined && quizData.lessonId) {
        const maxQuiz = await transactionalEntityManager
          .createQueryBuilder(Quiz, "quiz")
          .where("quiz.lessonId = :lessonId", { lessonId: quizData.lessonId })
          .orderBy("quiz.position", "DESC")
          .getOne();
        position =
          maxQuiz && typeof maxQuiz.position === "number"
            ? maxQuiz.position + 1
            : 1;
      }

      const quizEntity = this.repository.create({ ...quizData, position });
      const quiz = await transactionalEntityManager.save(quizEntity);

      if (options && options.length > 0) {
        const optionEntities = options.map((option, i) =>
          this.QuizOptionRepository.create({
            ...option, // spread the incoming option data
            quizId: quiz.id, // ensure it's linked to the new quiz
            position: option.position ?? i + 1,
          })
        );
        await transactionalEntityManager.save(optionEntities);
      }

      return transactionalEntityManager.findOne(Quiz, {
        where: { id: quiz.id },
        relations: ["options"],
      });
    });
  }

  async updateQuizWithOptions(
    id: number,
    quizData: Partial<Quiz>,
    options?: Partial<QuizOption>[]
  ): Promise<Quiz | null> {
    return this.runInTransaction(async (transactionalEntityManager) => {
      const quiz = await this.getById(id);
      if (!quiz) return null;

      const updatedQuizData = Object.fromEntries(
        Object.entries(quizData).filter(([_, value]) => value !== undefined)
      );

      const updatedQuiz = this.repository.merge(quiz, updatedQuizData);
      await transactionalEntityManager.save(updatedQuiz);

      if (options) {
        await transactionalEntityManager.delete("QuizOption", { quizId: id });
        let i = 0;
        for (const option of options) {
          const optionEntity = this.QuizOptionRepository.create({
            ...option,
            quizId: id,
            position: option.position ?? i + 1,
          });
          await transactionalEntityManager.save(optionEntity);
          i += 1;
        }
      }

      return transactionalEntityManager.findOne(Quiz, {
        where: { id },
        relations: ["options"],
      });
    });
  }
}

export const quizService = new QuizService();
