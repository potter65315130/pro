import type { Metadata } from 'next';
import { Prompt } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const prompt = Prompt({
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-prompt',
});

export const metadata: Metadata = {
  title: 'JobMatch',
  description: 'Find your perfect job',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className={prompt.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}