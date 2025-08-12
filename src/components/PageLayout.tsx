import React from 'react';
import Header from './Header';
import Footer from './Footer';

type PageLayoutProps = {
  children: React.ReactNode;
};

const PageLayout = ({ children }: PageLayoutProps) => (
  <div className="flex flex-col min-h-screen bg-neutral-50">
    <Header />
    <main className="flex-1 w-full max-w-6xl mx-auto sm:px-4 pb-4 sm:pb-8 sm:pt-20">{children}</main>
    <Footer />
  </div>
);

export default PageLayout; 