'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

const routes = [
  ['/', 'Home'],
  ['/ranking', 'Ranking'],
  ['/matches', 'Partidas'],
  ['/head-to-head', 'Confrontos'],
  ['/hall-of-fame', 'Hall da Fama'],
] as const;

export function MainNavigation() {
  const pathname = usePathname();

  return (
    <NavigationMenu aria-label="Navegação principal" className="max-w-none justify-end">
      <NavigationMenuList className="flex-wrap justify-end gap-1">
        {routes.map(([href, label]) => {
          const isActive = pathname === href || (href === '/ranking' && pathname.startsWith('/player/'));

          return (
            <NavigationMenuItem key={href}>
              <NavigationMenuLink
                className={cn(
                  'px-3 py-2 text-muted-foreground',
                  isActive && 'bg-accent text-accent-foreground ring-1 ring-border',
                )}
                render={<Link href={href} />}
              >
                {label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
