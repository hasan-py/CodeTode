import InputField from "@/components/common/form/inputField";
import Loading from "@/components/common/loading";
import { ECourseStatus } from "@packages/definitions";
import ActionFooter from "../actionFooter";
import Select from "@/components/common/form/select";
import { useCourseFormController } from "@/hooks/controller/course/useCourseFormController";
import { Controller } from "react-hook-form";

function CourseForm({ id }: { id?: number }) {
  const {
    control,
    handleSubmit,
    errors,
    isPending,
    isLoading,
    lemonSqueezyData,
    onSubmit,
    setOtherFieldValues,
  } = useCourseFormController({
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
            name="validityYear"
            control={control}
            render={({ field }) => (
              <Select
                label="Validity (Years)"
                error={errors.validityYear?.message}
                options={[
                  { value: 1, label: "1 Year" },
                  { value: 2, label: "2 Years" },
                  { value: 3, label: "3 Years" },
                ]}
                placeholder="Select Validity"
                className="w-full"
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

          <Controller
            name="lemonSqueezyProductId"
            control={control}
            render={({ field }) => (
              <Select
                label="Select Lemon Squeezy Course"
                error={errors.lemonSqueezyProductId?.message}
                disabled={!!id}
                options={
                  lemonSqueezyData?.map((product) => ({
                    value: product.id,
                    label: product.attributes.name,
                  })) || []
                }
                placeholder="Select Product"
                value={
                  lemonSqueezyData?.find(
                    (product) => product.id === field.value
                  )?.id
                }
                onChange={(val) => {
                  field.onChange(val);
                  setOtherFieldValues(val);
                }}
              />
            )}
          />

          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <InputField
                error={errors.name?.message}
                label="Course Name"
                type="text"
                placeholder="Enter course name"
                disabled
                {...field}
              />
            )}
          />

          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <InputField
                error={errors.price?.message}
                disabled
                label="Price"
                type="text"
                placeholder="Enter price"
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
                placeholder="Enter lesson description"
                rows={3}
                type="text"
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name="imageUrl"
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Course Image
                </label>
                {field.value ? (
                  <div className="relative w-64 h-48 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <img
                      src={field.value || "https://placehold.co/256x192"}
                      alt="Course preview"
                      className="object-cover w-full h-full object-center"
                      onError={(
                        e: React.SyntheticEvent<HTMLImageElement, Event>
                      ) => {
                        e.currentTarget.src = "https://placehold.co/256x192";
                      }}
                    />
                  </div>
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Please upload an image to the lemon squeezy product
                  </span>
                )}
              </div>
            )}
          />
        </div>
      </div>

      <ActionFooter
        isLoading={isPending}
        disabled={isPending}
        onSaveClick={handleSubmit(onSubmit)}
        saveBtnTitle={id ? "Update Course" : "Create Course"}
      />
    </>
  );
}

export default CourseForm;
