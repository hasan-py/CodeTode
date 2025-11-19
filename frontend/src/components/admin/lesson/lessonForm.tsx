import InputField from "@/components/common/form/inputField";
import Select from "@/components/common/form/select";
import { useLessonFormController } from "@/hooks/controller/lesson/useLessonFormController";
import { ECourseStatus, ELessonType } from "@packages/definitions";
import { Controller } from "react-hook-form";
import ActionFooter from "../actionFooter";

function LessonForm({ id }: { id?: number }) {
  const {
    control,
    handleSubmit,
    errors,
    setValue,
    onSubmit,
    isLoading,
    isPending,
    courseList,
    modulesDataList,
    chaptersDataList,
    moduleListMutate,
    chapterListMutate,
    setSelectedChapter,
    setSelectedModule,
    setSelectedCourse,
  } = useLessonFormController({ id });

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <Controller
            name="courseId"
            disabled={!!id || isLoading}
            control={control}
            render={({ field }) => (
              <Select
                disabled={!!id}
                label="Select course"
                error={errors.courseId?.message}
                options={
                  courseList?.courses?.map((product) => ({
                    value: product.id,
                    label: product.name,
                  })) || []
                }
                value={
                  courseList?.courses?.find(
                    (product) => product.id === field.value
                  )?.id
                }
                onChange={(val) => {
                  moduleListMutate({ courseId: Number(val) });
                  setSelectedCourse(Number(val));

                  setValue("courseId", Number(val), { shouldValidate: true });
                  setValue("moduleId", 0);
                  setValue("chapterId", 0);
                }}
                placeholder="Select course"
              />
            )}
          />

          <Controller
            name="moduleId"
            control={control}
            render={({ field }) => (
              <Select
                disabled={!!id || isLoading}
                label="Select module"
                error={errors.moduleId?.message}
                options={
                  modulesDataList?.modules?.map((product) => ({
                    value: product.id,
                    label: product.name,
                  })) || []
                }
                value={
                  modulesDataList?.modules?.find(
                    (product) => product.id === field.value
                  )?.id
                }
                onChange={(val) => {
                  chapterListMutate({
                    moduleId: Number(val),
                  });
                  setSelectedModule(Number(val));
                  setValue("moduleId", Number(val), { shouldValidate: true });
                  setValue("chapterId", 0);
                }}
                placeholder="Select module"
              />
            )}
          />

          <Controller
            name="chapterId"
            disabled={!!id}
            control={control}
            render={({ field }) => (
              <Select
                disabled={!!id || isLoading}
                label="Select chapter"
                error={errors.chapterId?.message}
                options={
                  chaptersDataList?.chapters?.map((product) => ({
                    value: product.id,
                    label: product.name,
                  })) || []
                }
                value={
                  chaptersDataList?.chapters?.find(
                    (product) => product.id === field.value
                  )?.id
                }
                onChange={(val) => {
                  setSelectedChapter(Number(val));
                  setValue("chapterId", Number(val), { shouldValidate: true });
                }}
                placeholder="Select chapter"
              />
            )}
          />

          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <InputField
                label="Lesson Name"
                error={errors.name?.message}
                type="text"
                placeholder="Enter lesson name"
                {...field}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <InputField
                label="Lesson Description"
                error={errors.description?.message}
                type="text"
                placeholder="Enter lesson description"
                {...field}
              />
            )}
          />

          <Controller
            name="xpPoints"
            control={control}
            render={({ field }) => (
              <InputField
                error={errors.xpPoints?.message}
                label="XP Points"
                type="number"
                placeholder="Enter XP Points"
                {...field}
              />
            )}
          />

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                label="Status"
                error={errors.status?.message}
                options={[
                  { value: ECourseStatus.DRAFT, label: "Draft" },
                  { value: ECourseStatus.PUBLISHED, label: "Published" },
                  { value: ECourseStatus.ARCHIVED, label: "Archived" },
                ]}
                placeholder="Select Status"
                {...field}
              />
            )}
          />

          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                label="Lesson Type"
                error={errors.type?.message}
                options={[
                  { value: ELessonType.THEORY, label: "Theory" },
                  { value: ELessonType.QUIZ, label: "Quiz" },
                  { value: ELessonType.CODING, label: "Coding" },
                ]}
                placeholder="Select Lesson Type"
                {...field}
              />
            )}
          />
        </div>
      </div>

      <ActionFooter
        isLoading={isPending}
        disabled={isPending}
        onSaveClick={handleSubmit(onSubmit)}
      />
    </>
  );
}

export default LessonForm;
