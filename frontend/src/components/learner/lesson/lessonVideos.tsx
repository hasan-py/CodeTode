import React from "react";

const LessonVideos: React.FC<{ url: string }> = ({ url }) => {
  if (!url) return "";

  return (
    <iframe
      className="w-full aspect-video rounded-lg"
      src={url}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    ></iframe>
  );
};

export default LessonVideos;
