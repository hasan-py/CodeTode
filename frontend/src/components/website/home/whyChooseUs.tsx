import { Award, Clock, GraduationCap } from "lucide-react";
import React from "react";
import type { ISectionProps } from "./featuredCourses";

interface WhyChooseUsProps extends ISectionProps {
  reasons?: ReasonCardProps[];
}

interface ReasonCardProps {
  icon?: "GraduationCap" | "Clock" | "Award";
  title?: string;
  description?: string;
}

export function WhyChooseUs({
  title = "Why Choose Our Platform",
  description = "We've helped thousands of students master new skills and advance their careers",
  reasons = [
    {
      icon: "GraduationCap",
      title: "Expert-led Courses",
      description:
        "Learn from industry professionals with years of experience in their respective fields. Our instructors are passionate about sharing their knowledge.",
    },
    {
      icon: "Clock",
      title: "Learn at Your Pace",
      description:
        "Flexible learning schedule that fits your lifestyle. Study when it's convenient for you, whether that's early morning or late at night.",
    },
    {
      icon: "Award",
      title: "Verified Certificates",
      description:
        "Earn recognized certificates upon completion that you can share with employers or on your professional profiles to showcase your skills.",
    },
  ],
}: WhyChooseUsProps) {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-400 max-w-3xl mx-auto">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <ReasonCard key={index} {...reason} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ReasonCard({ icon, title, description }: ReasonCardProps) {
  const iconComponent =
    icon === "GraduationCap" ? (
      <GraduationCap />
    ) : icon === "Clock" ? (
      <Clock />
    ) : (
      <Award />
    );

  // Use predefined Tailwind classes instead of string interpolation for better compatibility
  const cardClasses =
    "bg-gradient-to-r from-white to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm rounded-2xl  p-8 transform hover:scale-105 transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-indigo-500/20 dark:hover:shadow-indigo-500/20";

  // Predefine icon container styles
  const iconContainerClasses =
    "h-16 w-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-6";

  // Predefine icon styles
  const iconClasses = "h-8 w-8 text-indigo-700 dark:text-indigo-400";

  return (
    <div className={cardClasses}>
      <div className={iconContainerClasses}>
        {React.cloneElement(iconComponent, {
          className: iconClasses,
        })}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <p className="text-gray-700 dark:text-gray-400">{description}</p>
    </div>
  );
}
