// components/ContentRenderer.jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import styles from '../../styles/PhysicalCourse.module.scss'

export function ContentRenderer({ content }) {
  return (
    <ReactMarkdown
      // remarkPlugins={[remarkGfm]}
      components={{

        ol: ({ node, ...props }) => (
          <ol className="list-decimal pl-5 pr-5 pt-2 first:pt-0" {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul className="list-disc pl-5 pr-5 pt-2 first:pt-0" {...props} />
        ),

        li: ({ node, ...props }) => (
          <li className={`${styles.discriptionText} pt-2 first:pt-0`} {...props} />
        ),
        strong: ({ node, ...props }) => (
          <strong className="font-bold" {...props} />
        ),
        em: ({ node, ...props }) => <em className="italic" {...props} />,
        p: ({ node, ...props }) => (
          <p className={`${styles.discriptionText} pt-2 first:pt-0`} {...props} />
        ),
        a: ({ href, children, ...props }) => {
          if (!href) return <>{children}</>
          return (
            <Link
              href={href}
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </Link>
          )
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
