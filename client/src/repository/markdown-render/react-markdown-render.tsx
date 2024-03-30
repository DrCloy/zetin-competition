import { MarkdownRenderRepository } from 'core/repository';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export class MarkdownRender implements MarkdownRenderRepository {
  render(markdown: string): JSX.Element {
    return (
      // react-nmakrdown with gfm plugin
      <ReactMarkdown
        children={markdown}
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node, ...props }) => {
            return (
              <a
                {...props}
                target="_blank"
                rel="noreferrer noopener"
                title="새 창에서 열기"
                className="text-blue-500 underline hover:text-blue-700 "
              />
            );
          },
          h4: ({ node, ...props }) => {
            return (
              <h4 {...props} className="font-bold text-2xl">
                {props.children}
              </h4>
            );
          },
          ul: ({ node, ...props }) => {
            return <ul {...props} className="list-disc ml-10" />;
          },
          p: ({ node, ...props }) => {
            return <p {...props} className="mb-3" />;
          },
        }}
      />
    );
  }
}
