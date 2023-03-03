import { Html, Head, Main, NextScript } from 'next/document';

const Document = () => (
  <Html lang="ru">
    <Head>
      <link rel="icon" href="/favicon.ico" />
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
