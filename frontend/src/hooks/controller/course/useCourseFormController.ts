import {
  useCreateCourseMutation,
  useGetCourseQuery,
  useLemonSqueezyProductsQuery,
  useUpdateCourseMutation,
} from "@/hooks/query/course";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ECourseStatus,
  SCourseCreate,
  type TCourseCreate,
} from "@packages/definitions";
import { useEffect } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export function useCourseFormController({ id }: { id?: number }) {
  const { data: lemonSqueezyData } = useLemonSqueezyProductsQuery();
  const { data: courseData, isLoading } = useGetCourseQuery(id);

  const createCourseMutation = useCreateCourseMutation();
  const updateCourseMutation = useUpdateCourseMutation();

  const isPending =
    createCourseMutation.isPending || updateCourseMutation.isPending;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      validityYear: 0,
      status: ECourseStatus.DRAFT,
      lemonSqueezyProductId: "",
      name: "",
      price: 0,
      description: "",
      imageUrl: "",
    },
    resolver: zodResolver(SCourseCreate),
  });

  useEffect(() => {
    if (id && courseData) {
      reset({
        validityYear: courseData?.validityYear || 0,
        status: courseData?.status,
        lemonSqueezyProductId: courseData?.lemonSqueezyProductId || "",
        name: courseData?.name,
        price: courseData?.price ? +courseData.price : 0,
        description: courseData?.description,
        imageUrl: courseData?.imageUrl,
        enrollLink: courseData?.enrollLink || "",
      });
    }
  }, [id, courseData]);

  const onSubmit: SubmitHandler<TCourseCreate> = async (data) => {
    if (id) {
      await toast.promise(updateCourseMutation.mutateAsync({ ...data, id }), {
        loading: `Updating course...`,
        success: "Course updated successfully!",
        error: "Failed to update course",
      });
    } else {
      await toast.promise(createCourseMutation.mutateAsync(data), {
        loading: `Creating course...`,
        success: "Course created successfully!",
        error: "Failed to create course",
      });
      reset();
    }
  };

  const setOtherFieldValues = (
    val: string | number | (string | number)[] | null
  ) => {
    const selectedProduct = lemonSqueezyData?.find(
      (product) => product.id === val
    );

    if (selectedProduct) {
      setValue("price", selectedProduct?.attributes.price, {
        shouldValidate: true,
      });
      setValue("name", selectedProduct?.attributes.name, {
        shouldValidate: true,
      });
      setValue("description", selectedProduct?.attributes.description, {
        shouldValidate: true,
      });
      setValue("imageUrl", selectedProduct?.attributes.large_thumb_url, {
        shouldValidate: true,
      });
      setValue("enrollLink", selectedProduct?.attributes.buy_now_url, {
        shouldValidate: true,
      });
    }
  };

  return {
    control,
    handleSubmit,
    errors,
    isPending,
    isLoading,
    lemonSqueezyData,
    setValue,
    onSubmit,
    setOtherFieldValues,
  };
}
