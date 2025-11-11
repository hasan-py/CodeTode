import InputField from "@/components/common/form/inputField";
import Select from "@/components/common/form/select";
import Loading from "@/components/common/loading";
import { useModuleFormController } from "@/hooks/controller/course/useModuleFormController";
import { ECourseStatus } from "@packages/definitions";
import { Controller } from "react-hook-form";
import ActionFooter from "../actionFooter";
import LucideIconSelector from "@/components/common/form/lucideIconSelector";

function ModuleForm({ id }: { id?: number }) {
  const {
    CourseList,
    isLoading,
    isPending,
    control,
    handleSubmit,
    setValue,
    onSubmit,
    errors,
  } = useModuleFormController({
    id,
  });

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
                  CourseList?.courses?.map((product) => ({
                    value: product.id,
                    label: product.name,
                  })) || []
                }
                value={
                  CourseList?.courses?.find(
                    (product) => product.id === field.value
                  )?.id
                }
                onChange={(val) =>
                  setValue("courseId", Number(val), { shouldValidate: true })
                }
                placeholder="Select course"
              />
            )}
          />

          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <InputField
                error={errors.name?.message}
                label="Module Name"
                type="text"
                placeholder="Enter Module name"
                {...field}
              />
            )}
          />

          <Controller
            name="iconName"
            control={control}
            render={({ field }) => (
              <LucideIconSelector
                error={errors.iconName?.message}
                value={field.value}
                onChange={field.onChange}
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

export default ModuleForm;
