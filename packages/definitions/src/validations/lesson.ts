import z from "zod";
import { ECourseStatus, ELessonContentLinkType, ELessonType } from "../types";

export const SLessonBase = z.object({
  name: z
    .string({ message: "Lesson name is required" })
    .nonempty("Lesson name is required")
    .min(3, "Lesson name must be at least 3 characters"),
  description: z.string().nullable().optional(),
  status: z.enum(ECourseStatus).default(ECourseStatus.DRAFT),
  xpPoints: z.coerce
    .number({ message: "XP Points are required" })
    .int("XP points must be an integer")
    .positive("XP points must be positive")
    .default(5),
  type: z.enum(ELessonType),
});

export const SLessonCreate = SLessonBase.extend({
  courseId: z.coerce
    .number({ message: "Course ID is required" })
    .int()
    .positive("Course ID must be positive"),
  moduleId: z.coerce
    .number({ message: "Module ID is required" })
    .int()
    .positive("Module ID must be positive"),
  chapterId: z.coerce
    .number({ message: "Chapter ID is required" })
    .int()
    .positive("Chapter ID must be positive"),
});

export const SLessonUpdate = SLessonBase.extend({
  id: z.coerce
    .number({ message: "ID is required" })
    .int()
    .positive("ID must be positive"),
});

// Regex for markdown file
const dynamicPathRegexForLessonContent =
  /^([a-zA-Z0-9-_]+[/])*[a-zA-Z0-9-_]+\.md$/;

export const SLessonContentLinkBase = z.object({
  lessonId: z.coerce
    .number({ message: "Lesson ID is required" })
    .int()
    .positive("Lesson ID must be positive"),
  url: z.string().nonempty("URL or path is required."),
  title: z.string().nullable().optional(),
  linkType: z.enum(ELessonContentLinkType),
});

const linkRefinement = (
  data: z.infer<typeof SLessonContentLinkBase>,
  ctx: z.RefinementCtx
) => {
  if (data.linkType === ELessonContentLinkType.MARKDOWN) {
    const isPathValid = dynamicPathRegexForLessonContent.test(data.url);
    if (!isPathValid) {
      ctx.addIssue({
        code: "custom",
        message: "For MARKDOWN type, path must be like 'directory/file.md'",
        path: ["url"],
      });
    }
  } else {
    const isUrlValid = z.url().safeParse(data.url).success;
    if (!isUrlValid) {
      ctx.addIssue({
        code: "custom",
        message:
          "For this link type, a valid URL (e.g., https://...) is required",
        path: ["url"],
      });
    }
  }
};

export const SLessonContentLinkCreate =
  SLessonContentLinkBase.superRefine(linkRefinement);

export const SLessonContentLinkUpdate = SLessonContentLinkBase.extend({
  id: z.coerce
    .number({ message: "ID is required" })
    .int()
    .positive("ID must be positive"),
}).superRefine(linkRefinement);

export const SQuizOptionBase = z.object({
  text: z.string().min(1, "Option text is required"),
  isCorrect: z.boolean(),
});

export const SQuizOptionCreate = SQuizOptionBase;
export const SQuizOptionUpdate = SQuizOptionBase;

export const SQuizBase = z.object({
  courseId: z.coerce.number().int().positive("Course ID is required"),
  lessonId: z.coerce.number().int().positive("Lesson ID is required"),
  question: z
    .string()
    .min(3, "Question is required")
    .nonempty("Question is required"),
  explanation: z.string().nullable().optional(),
});

export const SQuizCreate = SQuizBase.extend({
  options: z
    .array(SQuizOptionCreate)
    .min(2, "At least two options are required")
    .refine((opts) => opts.some((o) => o.isCorrect), {
      message: "At least one option must be marked as correct",
    }),
});

export const SQuizUpdate = SQuizBase.extend({
  id: z.coerce.number().int().positive("ID is required"),
  options: z
    .array(SQuizOptionUpdate)
    .min(2, "At least two options are required")
    .refine((opts) => opts.some((o) => o.isCorrect), {
      message: "At least one option must be marked as correct",
    }),
});

export const SLessonUpdatePositionsParams = z.object({
  courseId: z.coerce
    .number({
      message: "courseId must be a number",
    })
    .int("courseId must be an integer")
    .positive("courseId must be a positive integer"),
  moduleId: z.coerce
    .number({
      message: "moduleId must be a number",
    })
    .int("moduleId must be an integer")
    .positive("moduleId must be a positive integer"),
  chapterId: z.coerce
    .number({
      message: "chapterId must be a number",
    })
    .int("chapterId must be an integer")
    .positive("chapterId must be a positive integer"),
});

export const SMarkdownLessonContentParams = z.object({
  path: z
    .string()
    .nonempty("path is required")
    .regex(
      dynamicPathRegexForLessonContent,
      "path must be like 'directory/file.md'"
    ),
});
