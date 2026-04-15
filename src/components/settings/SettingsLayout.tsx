'use client';

import { cn } from '@/lib/utils';
import { Building2, Euro, Palette, Users, Terminal } from 'lucide-react';

const settingsSections = [
    {
        id: 'campeggio',
        label: 'Campeggio',
        icon: Building2,
        description: 'Gestisci piazzole e tende',
    },
    {
        id: 'prezzi',
        label: 'Prezzi',
        icon: Euro,
        description: 'Configura tariffe e prezzi',
    },
    {
        id: 'gruppi',
        label: 'Gruppi',
        icon: Users,
        description: 'Gestisci gruppi clienti e sconti',
    },
    {
        id: 'aspetto',
        label: 'Aspetto',
        icon: Palette,
        description: 'Personalizza tema e layout',
    },
    {
        id: 'dev',
        label: 'Dev',
        icon: Terminal,
        description: 'Tools sviluppatore e statistiche',
    },
];

interface SettingsLayoutProps {
    children: React.ReactNode;
    activeSection: string;
    onSectionChange: (section: string) => void;
}

export function SettingsLayout({ children, activeSection, onSectionChange }: SettingsLayoutProps) {
    const activeItem = settingsSections.find(s => s.id === activeSection);

    return (
        <div className="min-h-screen bg-background">

            {/* Mobile: Select dropdown */}
            <div className="md:hidden px-4 pt-4 pb-2">
                <select
                    className="w-full h-10 rounded-lg border bg-background px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                    value={activeSection}
                    onChange={(e) => onSectionChange(e.target.value)}
                >
                    {settingsSections.map((section) => (
                        <option key={section.id} value={section.id}>{section.label}</option>
                    ))}
                </select>
            </div>

            {/* Tablet: Horizontal tab bar */}
            <div className="hidden md:flex lg:hidden border-b px-6 gap-1 overflow-x-auto">
                {settingsSections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    return (
                        <button
                            key={section.id}
                            onClick={() => onSectionChange(section.id)}
                            className={cn(
                                'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap -mb-px',
                                isActive
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {section.label}
                        </button>
                    );
                })}
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 md:px-6 py-4 md:py-6">
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* Desktop Sidebar only */}
                    <aside className="hidden lg:block w-64 shrink-0">
                        <nav className="space-y-1">
                            {settingsSections.map((section) => {
                                const Icon = section.icon;
                                const isActive = activeSection === section.id;

                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => onSectionChange(section.id)}
                                        className={cn(
                                            'w-full text-left px-4 py-3 rounded-lg transition-colors',
                                            'hover:bg-accent hover:text-accent-foreground',
                                            isActive && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
                                        )}
                                    >
                                        <div className="flex items-start gap-3">
                                            <Icon className="h-5 w-5 mt-0.5 shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium">{section.label}</div>
                                                <div className={cn(
                                                    'text-xs mt-0.5',
                                                    isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
                                                )}>
                                                    {section.description}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* Content Area */}
                    <main className="flex-1 min-w-0">
                        <div className="bg-card border rounded-lg p-4 md:p-6">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
