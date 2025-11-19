import "github-markdown-css/github-markdown.css";
import { Highlight, themes } from "prism-react-renderer";
import React, { useEffect, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import "./index.css";
import Mermaid from "./mermaid";

interface MarkdownViewerProps {
  markdownContent: string;
}

const CodeBlock: React.FC<{
  children?: React.ReactNode;
  className?: string;
}> = ({ className, children }) => {
  const [isCopied, setIsCopied] = useState(false);
  const codeText = String(children).replace(/\n$/, "");
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  if (language === "mermaid") {
    return <Mermaid chart={codeText} />;
  }

  return match ? (
    <div className="code-block-wrapper">
      <Highlight code={codeText} language={language} theme={themes.oneDark}>
        {({
          className: hClass,
          style,
          tokens,
          getLineProps,
          getTokenProps,
        }) => (
          <pre
            className={hClass}
            style={{ ...style, background: "transparent" }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
      <button className="copy-button" onClick={handleCopy}>
        {isCopied ? "Copied!" : "Copy"}
      </button>
    </div>
  ) : (
    <code className={className}>{children}</code>
  );
};

const components: Components = {
  code: CodeBlock,
};

function MarkdownViewer({ markdownContent }: MarkdownViewerProps) {
  const [currentTheme, setCurrentTheme] = useState(
    () => document.documentElement.getAttribute("data-theme") || "light"
  );

  useEffect(() => {
    const targetNode = document.documentElement;

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-theme"
        ) {
          const newTheme = targetNode.getAttribute("data-theme");
          console.log(`Theme changed to: ${newTheme}`);
          setCurrentTheme(newTheme || "light");
        }
      }
    });

    observer.observe(targetNode, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={`markdown-body  ${markdownContent ? "p-4" : ""}`}
      style={{
        background: "none",
        color: currentTheme === "dark" ? "#fff" : "#000",
      }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownViewer;
