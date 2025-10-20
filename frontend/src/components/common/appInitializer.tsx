import { useGetUserProfileQuery } from "@/hooks/query/account/user";

interface AppInitializerProps {
  children: React.ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  useGetUserProfileQuery();

  return <>{children}</>;
}
