import InputField from "@/components/common/form/inputField";
import Select from "@/components/common/form/select";
import MarkdownViewer from "@/components/common/markdown/markdownViewer";
import { Controller } from "react-hook-form";
import ActionFooter from "../actionFooter";
import { ELessonContentLinkType } from "@packages/definitions";
import { useLessonContentFormController } from "@/hooks/controller/lesson/useLessonContentFormController";

function LessonContentForm() {
  const {
    control,
    handleSubmit,
    errors,
    setValue,
    getValues,
    onSubmit,
    isPending,
    markdownContent,
    isLoadingLessons,
    markDownFileList,
    handleMarkdownFileChange,
  } = useLessonContentFormController();

  return (
    <>
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4">
          <Controller
            name="linkType"
            control={control}
            render={({ field }) => (
              <Select
                label="Select Content Type"
                error={errors.linkType?.message}
                options={[
                  { value: ELessonContentLinkType.MARKDOWN, label: "Markdown" },
                  { value: ELessonContentLinkType.VIDEO, label: "Video" },
                ]}
                placeholder="Select content type"
                disabled={isLoadingLessons}
                {...field}
                onChange={(val) => {
                  setValue("linkType", val as ELessonContentLinkType, {
                    shouldValidate: true,
                  });
                  setValue("url", "");
                }}
              />
            )}
          />

          <Controller
            name="lessonId"
            control={control}
            render={({ field }) => (
              <Select
                label="Select Lesson"
                error={errors.lessonId?.message}
                options={[]}
                searchable
                value={undefined}
                onChange={async (val) => {
                  console.log("val", val, field);
                }}
                placeholder="Select lesson"
                disabled={isLoadingLessons}
              />
            )}
          />

          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <InputField
                label="Title"
                error={errors.title?.message}
                type="text"
                placeholder="Enter title"
                {...field}
              />
            )}
          />

          <Controller
            name="url"
            control={control}
            render={({ field }) =>
              getValues("linkType") === ELessonContentLinkType.MARKDOWN ? (
                <Select
                  label="Select markdown file"
                  error={errors.url?.message}
                  options={
                    markDownFileList?.length
                      ? markDownFileList?.map((file) => ({
                          value: file,
                          label: file,
                        }))
                      : []
                  }
                  placeholder="All Types"
                  searchable
                  {...field}
                  onChange={(val) => {
                    handleMarkdownFileChange(val as string);
                    setValue("url", val as string, { shouldValidate: true });
                  }}
                />
              ) : (
                <InputField
                  label="URL"
                  error={errors.url?.message}
                  type="text"
                  placeholder="Enter url"
                  {...field}
                />
              )
            }
          />
        </div>

        {getValues("linkType") === ELessonContentLinkType.MARKDOWN ? (
          <>
            <h1 className="text-sm my-3">Markdown Preview</h1>
            <div className="border border-gray-700 rounded flex items-center justify-center py-4">
              {markdownContent ? (
                <MarkdownViewer markdownContent={markdownContent} />
              ) : (
                <p>Select a markdown file to preview its content</p>
              )}
            </div>
          </>
        ) : null}
      </div>

      <ActionFooter
        isLoading={isPending}
        onSaveClick={handleSubmit(onSubmit)}
      />
    </>
  );
}

export default LessonContentForm;
