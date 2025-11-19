import { zodResolver } from "@hookform/resolvers/zod";
import {
  ELessonContentLinkType,
  SLessonContentLinkCreate,
  type TLessonContentLinkCreate,
} from "@packages/definitions";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export function useLessonContentFormController() {
  const [markdownContent, setMarkdownContent] = useState(`
# My Markdown Title

This is some **bold** text and *italic* text.

- List item 1
- List item 2

\`\`\`javascript
console.log("Hello, Markdown!");
\`\`\`

\`\`\`
console.log("Hello, Markdown!");
print("hello")
\`\`\`

\`\`\`mermaid
graph TD;
    A[Start] --> B(Process Data);
    B --> C{Decision};
    C --> D[End];
\`\`\`
`);

  const isLoadingLessons = false;
  const isPending = false;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset,
  } = useForm({
    defaultValues: {
      lessonId: undefined,
      url: "",
      linkType: ELessonContentLinkType.MARKDOWN,
      title: "",
    },
    resolver: zodResolver(SLessonContentLinkCreate),
  });

  const markDownFileList: string[] = [];

  const handleMarkdownFileChange = (val: string) => {
    console.log("val", val);
  };

  const onSubmit = async (data: TLessonContentLinkCreate) => {
    console.log("data", data);
    const id = false;

    if (id) {
      await toast.promise(
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(true);
          }, 1000);
        }),
        {
          loading: `Updating lesson content...`,
          success: "Lesson content updated successfully!",
          error: "Failed to update lesson content",
        }
      );
    } else {
      await toast.promise(
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(true);
          }, 1000);
        }),
        {
          loading: `Creating lesson content...`,
          success: "Lesson content created successfully!",
          error: "Failed to create lesson content",
        }
      );
      reset();
      setMarkdownContent("");
    }
  };

  return {
    control,
    handleSubmit,
    errors,
    setValue,
    getValues,
    reset,
    markdownContent,
    setMarkdownContent,
    isLoadingLessons,
    isPending,
    markDownFileList,
    handleMarkdownFileChange,
    onSubmit,
  };
}
