import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html className="scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-400 scrollbar-thumb-rounded-full">
            <Head />
            <body>
                <Main />
            </body>
            <NextScript />
        </Html>
    )
}