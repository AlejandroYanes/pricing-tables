/* eslint-disable max-len */
import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => <h1 className="text-4xl mt-16 mb-12">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl mt-10 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl mt-8 mb-3">{children}</h3>,
    h4: ({ children }) => <h4 className="text-xl mt-8 mb-2">{children}</h4>,
    a: ({ children, href }) => <a href={href} className="text-neutral-600 dark:text-neutral-300 underline hover:text-emerald-700 dark:hover:text-emerald-300">{children}</a>,
    p: ({ children }) => <p className="my-1.5">{children}</p>,
    blockquote: ({ children }) => <blockquote className="my-6 pl-4 border-l-4 border-emerald-500 dark:border-emerald-700">{children}</blockquote>,
    ol: ({ children }) => <ol className="list-decimal list-inside my-3">{children}</ol>,
    pre: ({ children }) => <pre data-el="code-block" className="group p-6 my-6 rounded bg-neutral-50 dark:bg-slate-900 overflow-x-auto">{children}</pre>,
    code: ({ children }) => <code className="text-sm font-mono py-[1px] px-1 rounded-sm bg-emerald-200 dark:bg-emerald-800 group-data-[el=code-block]:bg-neutral-50 group-data-[el=code-block]:dark:bg-slate-900">{children}</code>,
    ...components,
  }
}
