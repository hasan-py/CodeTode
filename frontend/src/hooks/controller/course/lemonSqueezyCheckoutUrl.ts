import type { IUser } from "@packages/definitions";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";

export function useLemonSqueezyCheckout() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const checkout = useCallback(
    (
      enrollLink: string | undefined | null,
      user: IUser | null,
      courseId: number | undefined | null
    ) => {
      if (!enrollLink || !user) {
        navigate({
          to: "/signin",
        });
        return;
      }
      setLoading(true);
      const urlString = `${enrollLink}?checkout[email]=${user.email}&checkout[custom][userId]=${user.id}&checkout[custom][courseId]=${courseId}`;
      window.location.href = urlString;
    },
    [navigate]
  );

  return { checkoutLoading: loading, checkout };
}
