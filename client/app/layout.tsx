import './globals.css';
import { Press_Start_2P } from 'next/font/google';
import type { Metadata } from "next";
import ContextProvider from '@/context';
import { headers } from 'next/headers';


const pressStart2P = Press_Start_2P({
  subsets: ['latin'], // Specify subsets (e.g., latin)
  weight: '400', // Press Start 2P only comes in one weight (400)
  display: 'swap', // Controls the font's display behavior
});

export const metadata:Metadata = {
  title: 'DeReal',
  description: 'Share spontaneous moments, triggered by smart contracts',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookies = headers().get('cookie')

  return (
    <html lang="en">
      <ContextProvider cookies={cookies}><body  className={pressStart2P.className} >{children}</body></ContextProvider>
    </html>
  );
}

