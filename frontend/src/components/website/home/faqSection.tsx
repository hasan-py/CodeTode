import type { ISectionProps } from "./featuredCourses";

interface IFaqSectionProps extends ISectionProps {
  faqs?: IFaqItemProps[];
}

interface IFaqItemProps {
  question?: string;
  answer?: string;
}

interface IFaqItemComponentProps extends IFaqItemProps {
  isBorder?: boolean;
}

export function FaqSection({
  title = "Frequently Asked Questions",
  faqs = [
    {
      question: "How long do I have access to the course?",
      answer:
        "You have lifetime access to the course content after enrollment. You can revisit the material whenever you need to refresh your knowledge.",
    },
    {
      question: "Are the courses self-paced?",
      answer:
        "Yes, all courses are self-paced, and you can learn at your own speed. There are no deadlines, so you can take as much time as you need to complete each course.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "Yes, we offer a 30-day money-back guarantee if you're not satisfied with your purchase. No questions asked.",
    },
    {
      question: "Will I receive a certificate?",
      answer:
        "Yes, you'll receive a certificate of completion after finishing the course. This can be added to your resume or LinkedIn profile.",
    },
    {
      question: "What are the system requirements?",
      answer:
        "Our courses are accessible on any device with an internet connection.  We recommend using a modern browser for the best experience.",
    },
  ],
}: IFaqSectionProps) {
  return (
    <section className="pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-white to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-200 dark:border-gray-700">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
              {title}
            </h2>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <FaqItem
                  isBorder={index + 1 < faqs.length}
                  key={index}
                  {...faq}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FaqItem({
  question,
  answer,
  isBorder,
}: IFaqItemComponentProps) {
  return (
    <div
      className={`${
        isBorder ? "border-b border-gray-200 dark:border-gray-700" : ""
      } pb-6`}
    >
      <div className="flex justify-between items-center w-full text-left focus:outline-none group">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-indigo-400 transition-colors">
          {question}
        </h3>
      </div>
      <div className="mt-3">
        <p className="text-gray-700 dark:text-gray-400">{answer}</p>
      </div>
    </div>
  );
}
