import InputField from "@/components/common/form/inputField";
import Select from "@/components/common/form/select";
import Loading from "@/components/common/loading";
import { ECourseStatus } from "@packages/definitions";
import { Controller } from "react-hook-form";
import ActionFooter from "../actionFooter";
import { useChapterFormController } from "@/hooks/controller/course/useChapterFormController";

function ChapterForm({ id }: { id?: number }) {
  const {
    control,
    handleSubmit,
    errors,
    isPending,
    isLoading,
    setValue,
    onSubmit,
    courseListData,
    moduleListData,
    fetchModules,
  } = useChapterFormController({ id });

  if (isLoading) {
    return <Loading fullscreen />;
  }

  return (
    <>
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-3 gap-4">
          <Controller
            name="courseId"
            disabled={!!id}
            control={control}
            render={({ field }) => (
              <Select
                disabled={!!id}
                label="Select course"
                error={errors.courseId?.message}
                options={
                  courseListData?.courses?.map((product) => ({
                    value: product.id,
                    label: product.name,
                  })) || []
                }
                value={
                  courseListData?.courses?.find(
                    (product) => product.id === field.value
                  )?.id
                }
                onChange={(val) => {
                  fetchModules(Number(val));
                  setValue("courseId", Number(val), { shouldValidate: true });
                  setValue("moduleId", Number(undefined));
                }}
                placeholder="Select course"
              />
            )}
          />

          <Controller
            name="moduleId"
            disabled={!!id}
            control={control}
            render={({ field }) => (
              <Select
                disabled={!!id}
                label="Select module"
                error={errors.moduleId?.message}
                options={
                  moduleListData?.modules?.map((product) => ({
                    value: product.id,
                    label: product.name,
                  })) || []
                }
                value={
                  moduleListData?.modules?.find(
                    (product) => product.id === field.value
                  )?.id
                }
                onChange={(val) =>
                  setValue("moduleId", Number(val), { shouldValidate: true })
                }
                placeholder="Select module"
              />
            )}
          />

          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <InputField
                error={errors.name?.message}
                label="Chapter Name"
                type="text"
                placeholder="Enter chapter name"
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <InputField
                error={errors.description?.message}
                label="Description"
                isTextArea
                placeholder="Enter description"
                rows={3}
                type="text"
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
                className="w-full"
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

export default ChapterForm;
