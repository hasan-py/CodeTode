import mermaid from "mermaid";
import React, { useEffect, useRef } from "react";

interface MermaidProps {
  chart: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !chart) return;

    const id = `mermaid-graph-${Math.random().toString(36).substring(2, 9)}`;

    mermaid
      .render(id, chart)
      .then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg;
        }
      })
      .catch((err) => {
        console.error("Mermaid render error:", err);
        if (ref.current) {
          ref.current.innerHTML = `<pre>Mermaid Error:\n${
            err instanceof Error ? err.message : String(err)
          }</pre>`;
        }
      });
  }, [chart]);

  return <div className="mermaid flex justify-center" ref={ref} />;
};

export default Mermaid;
