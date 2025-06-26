// components/ContentRenderer.jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import styles from '../../styles/PhysicalCourse.module.scss'

export function ContentRenderer({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        ol: ({ node, ...props }) => (
          <ol className="list-decimal pl-5 pt-4" {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul className="list-disc pl-5 pt-4" {...props} />
        ),
        li: ({ node, ...props }) => (
          <li className={styles.discriptionText} {...props} />
        ),
        strong: ({ node, ...props }) => (
          <strong className="font-bold" {...props} />
        ),
        em: ({ node, ...props }) => <em className="italic" {...props} />,
        p: ({ node, ...props }) => (
          <p className={styles.discriptionText} {...props} />
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
