import './globals.css';
import { Press_Start_2P } from 'next/font/google';

const pressStart2P = Press_Start_2P({
  subsets: ['latin'], // Specify subsets (e.g., latin)
  weight: '400', // Press Start 2P only comes in one weight (400)
  display: 'swap', // Controls the font's display behavior
});

export const metadata = {
  title: 'DeReal',
  description: 'Share spontaneous moments, triggered by smart contracts',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={pressStart2P.className}>{children}</body>
    </html>
  );
}
