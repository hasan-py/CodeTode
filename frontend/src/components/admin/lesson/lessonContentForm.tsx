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
    isLoading,
    markDownFileList,
    handleMarkdownFileChange,
    setMarkdownContent,
    lessonsData,
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
                disabled={isLoading}
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
                options={
                  lessonsData?.lessons?.map((lesson) => ({
                    value: lesson.id,
                    label: lesson.name,
                  })) || []
                }
                searchable
                value={
                  lessonsData?.lessons?.find(
                    (lesson) => +lesson.id === +(field.value ?? 0)
                  )?.id
                }
                onChange={async (val) => {
                  setValue("lessonId", Number(val), { shouldValidate: true });
                  const selectedLesson = lessonsData?.lessons?.find(
                    (lesson) => lesson.id === Number(val)
                  );
                  if (!selectedLesson?.contentLinks?.length) {
                    setValue("url", "");
                    setValue("title", "");
                    setMarkdownContent("");
                    return;
                  }
                  if (selectedLesson?.contentLinks?.length) {
                    handleMarkdownFileChange(
                      selectedLesson.contentLinks[0].url
                    );

                    if (selectedLesson?.contentLinks?.[0]?.linkType) {
                      setValue(
                        "linkType",
                        selectedLesson.contentLinks[0]
                          .linkType as ELessonContentLinkType,
                        { shouldValidate: true }
                      );
                    }

                    setValue("url", selectedLesson.contentLinks[0].url, {
                      shouldValidate: true,
                    });
                    setValue(
                      "title",
                      selectedLesson.contentLinks[0].title || "",
                      { shouldValidate: true }
                    );
                  }
                }}
                placeholder="Select lesson"
                disabled={isLoading}
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
