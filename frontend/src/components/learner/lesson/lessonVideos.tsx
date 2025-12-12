import React from "react";

const LessonVideos: React.FC<{ urls: string[] }> = ({ urls }) => {
  if (!urls?.length) return "";

  return (
    <div className="antialiased transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 md:px-8 relative">
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">
            Related Videos on Youtube
          </h1>
          <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">
            A collection of interesting moments worth watching.
          </p>
        </header>

        <div
          id="clips-container"
          className="flex space-x-8 overflow-x-auto pb-6"
        >
          {urls?.map((url: string) => (
            <div className="flex-none w-11/12 md:w-2/3 lg:w-1/2 xl:w-2/5">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-2xl dark:shadow-slate-900/50">
                <div
                  className="relative w-full"
                  style={{ paddingTop: "56.25%" }}
                >
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={
                      url ||
                      "https://www.youtube.com/embed/w7lcCg03Zgo?start=200&end=300"
                    }
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LessonVideos;
