import InputField from "@/components/common/form/inputField";
import Loading from "@/components/common/loading";
import { ECourseStatus } from "@packages/definitions";
import ActionFooter from "../actionFooter";
import Select from "@/components/common/form/select";

function CourseForm({ id }: { id?: number }) {
  const courseDataLoading = false;
  const lemonSqueezyData: any[] = [];

  if (courseDataLoading) {
    return <Loading fullscreen />;
  }

  return (
    <>
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-3 gap-4">
          <Select
            label="Validity (Years)"
            options={[
              { value: 1, label: "1 Year" },
              { value: 2, label: "2 Years" },
              { value: 3, label: "3 Years" },
            ]}
            placeholder="Select Validity"
            className="w-full"
            value={undefined}
            onChange={() => {}}
          />

          <Select
            label="Status"
            options={[
              { value: ECourseStatus.DRAFT, label: "Draft" },
              { value: ECourseStatus.PUBLISHED, label: "Published" },
              { value: ECourseStatus.ARCHIVED, label: "Archived" },
            ]}
            placeholder="Select Status"
            className="w-full"
            value={undefined}
            onChange={() => {}}
          />

          <Select
            label="Select Lemon Squeezy Course"
            options={
              lemonSqueezyData?.map((product) => ({
                value: product.id,
                label: product.attributes.name,
              })) || []
            }
            placeholder="Select Product"
            value={undefined}
            onChange={() => {}}
          />

          <InputField
            name="name"
            disabled
            label="Course Name"
            type="text"
            placeholder="Enter Course Name"
          />

          <InputField
            name="price"
            disabled
            label="Price"
            type="text"
            placeholder="Enter price"
          />

          <InputField
            label="Description"
            isTextArea
            placeholder="Enter lesson description"
            rows={3}
            type="text"
            name="description"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Course Image
            </label>
            <div className="relative w-64 h-48 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
              <img
                src={"https://placehold.co/256x192"}
                alt="Course preview"
                className="object-cover w-full h-full object-center"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  e.currentTarget.src = "https://placehold.co/256x192";
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <ActionFooter
        isLoading={false}
        disabled={false}
        onSaveClick={() => {}}
        saveBtnTitle={id ? "Update Course" : "Create Course"}
      />
    </>
  );
}

export default CourseForm;
