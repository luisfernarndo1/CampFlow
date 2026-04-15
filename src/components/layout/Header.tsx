'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Calendar, Settings, Info, Tent, UserCheck, BarChart3, Users, ArrowDownCircle, ArrowUpCircle, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const NAV_ITEMS = [
    { label: 'Arrivi', href: '/arrivals', icon: ArrowDownCircle },
    { label: 'Partenze', href: '/departures', icon: ArrowUpCircle },
    { label: 'Occupazione', href: '/occupancy', icon: Calendar },
    { label: 'Check-in', href: '/checkin', icon: UserCheck },
    { label: 'Clienti', href: '/customers', icon: Users },
    { label: 'Statistiche', href: '/stats', icon: BarChart3 },
    { label: 'Impostazioni', href: '/settings', icon: Settings },
    { label: 'Info', href: '/info', icon: Info },
];

export function Header() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Hide App Header on Website Routes OR Login Page
    if (pathname?.startsWith('/w') || pathname === '/login') {
        return null;
    }

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
                <div className="w-full px-4 h-16 flex items-center justify-between">
                    {/* Logo / Brand */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 group transition-opacity hover:opacity-80"
                    >
                        <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <Tent className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">CampFlow</h1>
                        </div>
                    </Link>

                    {/* Desktop Navigation - hidden on small screens */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {NAV_ITEMS.map((item, index) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <div key={item.href} className="flex items-center">
                                    <Link href={item.href}>
                                        <Button
                                            variant={isActive ? "secondary" : "ghost"}
                                            size="sm"
                                            className={cn(
                                                "h-9 px-3 gap-2",
                                                isActive && "font-medium"
                                            )}
                                        >
                                            <Icon className={cn("h-4 w-4", isActive ? "text-foreground" : "text-muted-foreground")} />
                                            <span className="hidden xl:inline-block">{item.label}</span>
                                        </Button>
                                    </Link>
                                    {index === 1 && (
                                        <div className="h-6 w-[1px] bg-border mx-1" />
                                    )}
                                </div>
                            );
                        })}
                    </nav>

                    {/* Tablet: Icon-only navigation */}
                    <nav className="hidden sm:flex lg:hidden items-center gap-0.5">
                        {NAV_ITEMS.map((item, index) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <div key={item.href} className="flex items-center">
                                    <Link href={item.href}>
                                        <Button
                                            variant={isActive ? "secondary" : "ghost"}
                                            size="sm"
                                            className={cn(
                                                "h-9 w-9 p-0",
                                                isActive && "font-medium"
                                            )}
                                            title={item.label}
                                        >
                                            <Icon className={cn("h-4 w-4", isActive ? "text-foreground" : "text-muted-foreground")} />
                                        </Button>
                                    </Link>
                                    {index === 1 && (
                                        <div className="h-6 w-[1px] bg-border mx-1" />
                                    )}
                                </div>
                            );
                        })}
                    </nav>

                    {/* Mobile: Hamburger button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="sm:hidden h-9 w-9 p-0"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </header>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="sm:hidden fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b shadow-lg">
                    <nav className="w-full px-4 py-3 space-y-1">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                                        isActive
                                            ? 'bg-secondary text-secondary-foreground'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                    )}
                                >
                                    <Icon className={cn("h-5 w-5", isActive ? "text-foreground" : "text-muted-foreground")} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            )}
        </>
    );
}
