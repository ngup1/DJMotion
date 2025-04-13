// app/layout.tsx
export const metadata = {
    title: 'Air DJ',
    description: 'Control music with your hands using AI',
  };
  
  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }
  