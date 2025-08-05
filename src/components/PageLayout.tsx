import React from 'react';
import Header from './Header';
import Footer from './Footer';

type PageLayoutProps = {
  children: React.ReactNode;
};

const PageLayout = ({ children }: PageLayoutProps) => (
  <div className="flex flex-col min-h-screen bg-neutral-50">
    <Header />
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 pt-24">{children}</main>
    <Footer />
  </div>
);

export default PageLayout;
