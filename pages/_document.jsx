import Document, { Html, Main, Head, NextScript } from "next/document";

import clsx from 'clsx'

const metadata = {
  title: {
    template: '%s - AdEditor',
    default: 'AdEditor - Ad generation for data driven marketers',
  },
  description:
    'TODO Most bookkeeping software is accurate, but hard to use. We make the opposite trade-off, and hope you don’t get audited.',
}


class MyDocument extends Document {
  render() {
    return (
      <Html 
      lang="en"
      className={clsx(
        'h-full scroll-smooth bg-white antialiased font-sans',
      )}>
        <Head />
        <body className="flex h-full flex-col">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;