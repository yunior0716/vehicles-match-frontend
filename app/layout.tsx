import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/navigation';
import { FavoritesProvider } from '@/contexts/favorites-context';
import { CharacteristicsProvider } from '@/contexts/characteristics-context';
import { SavedFiltersProvider } from '@/contexts/saved-filters-context';
import { QueryProvider } from '@/providers/QueryProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VehicleMatch - Encuentra tu vehículo ideal',
  description: 'Sistema inteligente de recomendación de vehículos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <QueryProvider>
          <CharacteristicsProvider>
            <SavedFiltersProvider>
              <FavoritesProvider>
                <Navigation />
                <main>{children}</main>
              </FavoritesProvider>
            </SavedFiltersProvider>
          </CharacteristicsProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
