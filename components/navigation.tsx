'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Car,
  Filter,
  Heart,
  Home,
  List,
  Settings,
  Database,
} from 'lucide-react';
import { useFavorites } from '@/contexts/favorites-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navigation() {
  const pathname = usePathname();
  const { favorites } = useFavorites();

  const navItems = [
    { href: '/', label: 'Inicio', icon: Home },
    { href: '/create-vehicle', label: 'Crear Vehículo', icon: Car },
    { href: '/filters', label: 'Filtros', icon: Filter },
    { href: '/results', label: 'Resultados', icon: List },
    { href: '/favorites', label: 'Favoritos', icon: Heart },
  ];

  const adminItems = [
    { href: '/admin', label: 'Estado API', icon: Database },
    { href: '/admin/vehicles', label: 'Vehículos', icon: Car },
    {
      href: '/admin/characteristics',
      label: 'Características',
      icon: Database,
    },
    { href: '/admin/filters', label: 'Filtros Guardados', icon: Filter },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">
              VehicleMatch
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    {item.href === '/favorites' && favorites.length > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-1">
                        {favorites.length}
                      </span>
                    )}
                  </Button>
                </Link>
              );
            })}

            {/* Admin Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Admin</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {adminItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link
                        href={item.href}
                        className="flex items-center space-x-2"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu */}
          <div className="md:hidden flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    className="relative"
                  >
                    <Icon className="h-4 w-4" />
                    {item.href === '/favorites' && favorites.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {favorites.length}
                      </span>
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
