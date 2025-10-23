import { useProfileFormController } from "@/hooks/controller/account/useProfileFormController";
import InputField from "../common/form/inputField";
import { Controller } from "react-hook-form";
import Button from "../common/button";

function ProfileForm() {
  const { control, errors, isSubmitting, onSubmit, handleSubmit, user } =
    useProfileFormController();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center space-x-6">
        <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300 text-2xl font-bold overflow-hidden border-2 border-gray-200 dark:border-gray-600">
          <Controller
            name="imageUrl"
            control={control}
            render={({ field }) => (
              <img
                className="h-full w-full object-cover rounded-full"
                src={field.value || "https://placehold.co/24"}
                alt="Profile"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  e.currentTarget.src = "https://placehold.co/50";
                }}
              />
            )}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          label="Username"
          name="username"
          type="text"
          placeholder="Enter username"
          value={user?.username || ""}
          disabled
        />

        <InputField
          label="Email"
          name="email"
          type="email"
          placeholder="Enter email"
          value={user?.email || ""}
          disabled
        />

        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <InputField
              label="Full Name"
              type="text"
              placeholder="Enter full name"
              error={errors.name?.message}
              {...field}
            />
          )}
        />

        <Controller
          name="imageUrl"
          control={control}
          render={({ field }) => (
            <InputField
              label="Image URL"
              type="text"
              placeholder="Enter new image URL"
              error={errors.imageUrl?.message}
              info={
                !errors?.imageUrl?.message
                  ? "Paste a direct link to an image (JPG, GIF, PNG)."
                  : undefined
              }
              {...field}
            />
          )}
        />

        <div className="mt-6">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Profile"}
          </Button>
        </div>

        <div className="flex justify-between items-center mt-8">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Last Login:</span>
            <span className="ml-2">
              {user?.lastLogin
                ? new Date(user.lastLogin).toLocaleString()
                : "-"}
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Joined Date:</span>
            <span className="ml-2">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "-"}
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ProfileForm;
