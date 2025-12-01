import { CtaSection } from "@/components/website/home/ctaSection";
import { FaqSection } from "@/components/website/home/faqSection";
import { FeaturedCourses } from "@/components/website/home/featuredCourses";
import Hero from "@/components/website/home/hero";
import { WhyChooseUs } from "@/components/website/home/whyChooseUs";
import { useAuthController } from "@/hooks/controller/account/useAuthController";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(website)/_layout/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isAuthenticated } = useAuthController();

  return (
    <>
      <Hero isAuthenticated={isAuthenticated} />
      <FeaturedCourses courses={[]} />
      <FaqSection />
      <WhyChooseUs />
      <CtaSection isAuthenticated={isAuthenticated} />
    </>
  );
}
