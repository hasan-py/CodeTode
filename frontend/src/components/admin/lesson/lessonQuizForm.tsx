import InputField from "@/components/common/form/inputField";
import Select from "@/components/common/form/select";
import { SortableList } from "@/components/common/sortableList";
import { Check, GripVertical, Plus, X } from "lucide-react";
import { useCallback } from "react";
import { Controller } from "react-hook-form";
import ActionFooter from "../actionFooter";
import { useQuizFormController } from "@/hooks/controller/lesson/useQuizFormController";
import Button from "@/components/common/button";

export function LessonQuizForm() {
  const {
    handleSubmit,
    control,
    formState: { errors },
    isPending,
    isLoading,
    fields,
    addOption,
    removeOption,
    updateOptionCorrect,
    handleReorder,
    onSubmit,
    setValue,
    reset,
    trigger,
    lessonsData,
  } = useQuizFormController();

  const RenderQuizOption = useCallback(
    (
      option: { id: string; text: string; isCorrect: boolean },
      dndProps: { attributes?: object; listeners?: object }
    ) => {
      const index = fields.findIndex((field) => field.id === option.id);
      if (index === -1) return null;

      return (
        <div className="flex items-start space-x-2">
          <div
            {...dndProps.attributes}
            {...dndProps.listeners}
            className="cursor-grab active:cursor-grabbing mr-3"
          >
            <GripVertical className="text-gray-500 h-6 w-6" />
          </div>

          <div className="flex-grow">
            <Controller
              name={`options.${index}.text` as const}
              control={control}
              render={({ field: textField }) => (
                <InputField
                  name={`options.${index}.text`}
                  type="text"
                  placeholder="Enter option"
                  value={textField.value}
                  onChange={textField.onChange}
                  className="w-full"
                  error={errors.options?.[index]?.text?.message}
                />
              )}
            />
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Controller
                name={`options.${index}.isCorrect` as const}
                control={control}
                render={({ field: correctField }) => (
                  <>
                    <input
                      id={`correct-${index}`}
                      type="checkbox"
                      checked={!!correctField.value}
                      onChange={() => updateOptionCorrect(index)}
                      className="peer hidden"
                    />
                    <label
                      htmlFor={`correct-${index}`}
                      className="flex items-center cursor-pointer select-none"
                    >
                      <span
                        className="w-5 h-5 flex items-center justify-center rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 transition-colors
                        peer-checked:bg-indigo-600 peer-checked:border-indigo-600 peer-checked:dark:bg-indigo-500 peer-checked:dark:border-indigo-500"
                      >
                        {correctField.value && (
                          <Check className="text-green-700 w-4 h-4" />
                        )}
                      </span>
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Correct
                      </span>
                    </label>
                  </>
                )}
              />
            </div>
            <Button
              size="xs"
              variant="danger"
              onClick={() => removeOption(index)}
              icon={<X className="h-4 w-4" />}
              disabled={fields.length <= 2}
            />
          </div>
        </div>
      );
    },
    [control, fields, errors.options]
  );

  return (
    <>
      <div className="p-6 grid grid-cols-2 gap-4">
        <div className="space-y-4">
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
                  const selectedLesson = lessonsData?.lessons?.find(
                    (lesson) => lesson.id === val
                  );
                  if (selectedLesson?.quizzes?.length) {
                    setValue("question", selectedLesson.quizzes[0].question, {
                      shouldValidate: true,
                    });
                    setValue(
                      "explanation",
                      selectedLesson.quizzes[0].explanation,
                      { shouldValidate: true }
                    );
                    setValue("options", selectedLesson.quizzes[0].options, {
                      shouldValidate: true,
                    });

                    await trigger("options");
                  } else {
                    reset();
                  }
                  setValue("lessonId", Number(val), { shouldValidate: true });
                }}
                placeholder="Select lesson"
                disabled={isLoading}
              />
            )}
          />

          <Controller
            name="question"
            control={control}
            render={({ field }) => (
              <InputField
                label="Quiz Title"
                error={errors.question?.message}
                type="text"
                placeholder="Enter quiz title"
                {...field}
              />
            )}
          />

          <Controller
            name="explanation"
            control={control}
            render={({ field }) => (
              <InputField
                label="Explanation"
                error={errors.explanation?.message}
                isTextArea
                type="text"
                rows={3}
                placeholder="Enter quiz explanation"
                {...field}
              />
            )}
          />
        </div>

        <div className="space-y-4 ml-8">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Quiz Options
          </label>

          <div className="-ml-8">
            <SortableList
              items={fields.map((field) => ({
                id: field.id,
                text: field.text || "",
                isCorrect: field.isCorrect || false,
              }))}
              onItemsReorder={handleReorder}
              renderItem={RenderQuizOption}
              itemIdKey="id"
              containerClassName="space-y-3"
            />
          </div>

          <Button
            type="button"
            size="xs"
            variant="secondary"
            onClick={addOption}
            icon={<Plus className="h-4 w-4" />}
          >
            Add Option
          </Button>

          {errors.options?.message && (
            <div className="text-red-400 text-sm mt-2">
              {errors.options.message}
            </div>
          )}

          {errors.options?.root?.message && (
            <div className="text-red-400 text-sm mt-2">
              {errors.options.root.message}
            </div>
          )}
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
