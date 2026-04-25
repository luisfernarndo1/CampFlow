'use client';

import {
    clearBookingsAction,
    clearCustomersAction,
    clearPitchesAction,
    clearSeasonsAction,
    seedPitchesAction,
    seedSeasonsAction,
    resetSystemAction,
    generateBackupAction
} from '../login/actions';
import DestructiveActionDialog from './DestructiveActionDialog';
import { useState } from 'react';
import { Download, Loader2, CheckSquare, Square } from 'lucide-react';


function ActionCard({ title, desc, icon, children }: { title: string, desc: string, icon: string, children: React.ReactNode }) {
    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded p-4 flex flex-col justify-between gap-4 hover:border-gray-700 transition-colors">
            <div>
                <div className="flex items-center gap-2 mb-2 text-gray-300 font-semibold text-sm">
                    <span>{icon}</span> {title}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
            {children}
        </div>
    );
}

function ActionButton({ label, theme = 'gray' }: { label: string, theme?: 'red' | 'yellow' | 'blue' | 'orange' | 'green' | 'gray' }) {
    const colors = {
        red: 'text-red-500 border-red-500/30 hover:bg-red-500/10',
        yellow: 'text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/10',
        blue: 'text-blue-500 border-blue-500/30 hover:bg-blue-500/10',
        orange: 'text-orange-500 border-orange-500/30 hover:bg-orange-500/10',
        green: 'text-green-500 border-green-500/30 hover:bg-green-500/10',
        gray: 'text-gray-400 border-gray-600/30 hover:bg-gray-800',
    };

    return (
        <button className={`w-full py-2 px-3 rounded border text-[10px] font-bold uppercase tracking-wider transition-all ${colors[theme]}`}>
            {label}
        </button>
    );
}

export default function DatabaseManagerWidget() {
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [selectedTables, setSelectedTables] = useState<string[]>([
        'customers',
        'bookings',
        'booking_guests',
        'pitches',
        'sectors',
        'pricing_seasons',
        'customer_groups',
        'group_season_configuration',
        'group_bundles',
        'app_logs'
    ]);

    const allAvailableTables = [
        'customers',
        'bookings',
        'booking_guests',
        'pitches',
        'sectors',
        'pricing_seasons',
        'customer_groups',
        'group_season_configuration',
        'group_bundles',
        'app_logs'
    ];

    const handleBackup = async () => {
        if (selectedTables.length === 0) {
            alert('Please select at least one table to backup.');
            return;
        }
        setIsBackingUp(true);
        try {
            const result = await generateBackupAction(selectedTables);
            if (result.success && result.backup) {
                const blob = new Blob([JSON.stringify(result.backup, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                const tablesLabel = selectedTables.length === allAvailableTables.length ? 'full' : 'partial';
                a.download = `campflow_backup_${tablesLabel}_${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else {
                alert('Backup failed: ' + (result.error || 'Unknown error'));
            }
        } catch (error: any) {
            alert('Backup failed: ' + error.message);
        } finally {
            setIsBackingUp(false);
        }
    };

    const toggleTable = (table: string) => {
        setSelectedTables(prev =>
            prev.includes(table)
                ? prev.filter(t => t !== table)
                : [...prev, table]
        );
    };

    const toggleAll = () => {
        if (selectedTables.length === allAvailableTables.length) {
            setSelectedTables([]);
        } else {
            setSelectedTables(allAvailableTables);
        }
    };

    return (

        <div className="space-y-6">
            <h2 className="text-gray-400 font-semibold uppercase text-xs tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                Database Management
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* 1. Transactional Data */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2">Transactional Data</h3>

                    <DestructiveActionDialog
                        title="Clear Bookings"
                        description={
                            <ul className="list-disc pl-4 space-y-1">
                                <li>Deletes <strong>ALL Bookings</strong></li>
                                <li>Deletes <strong>ALL Guests</strong></li>
                                <li>Preserves Customers, Pitches, Seasons</li>
                            </ul>
                        }
                        confirmKeyword="CLEAR"
                        actionFn={clearBookingsAction}
                        theme="yellow"
                        trigger={<ActionButton label="Clear Bookings" theme="yellow" />}
                    />

                    <DestructiveActionDialog
                        title="Clear Customers"
                        description={
                            <ul className="list-disc pl-4 space-y-1">
                                <li>Deletes <strong>ALL Customers</strong></li>
                                <li>Deletes <strong>ALL Bookings</strong> (Cascade)</li>
                                <li>Deletes <strong>ALL Guests</strong> (Cascade)</li>
                            </ul>
                        }
                        confirmKeyword="CUSTOMERS"
                        actionFn={clearCustomersAction}
                        theme="blue"
                        trigger={<ActionButton label="Clear Customers" theme="blue" />}
                    />
                </div>

                {/* 2. Configuration */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2">Configuration</h3>

                    <DestructiveActionDialog
                        title="Clear Pitches"
                        description="Deletes all configured pitches. The grid will be empty until you re-seed."
                        confirmKeyword="PITCHES"
                        actionFn={clearPitchesAction}
                        theme="orange"
                        trigger={<ActionButton label="Clear Pitches" theme="orange" />}
                    />

                    <DestructiveActionDialog
                        title="Clear Seasons"
                        description="Deletes all pricing seasons. Pricing calculations will fail until you re-seed."
                        confirmKeyword="SEASONS"
                        actionFn={clearSeasonsAction}
                        theme="orange"
                        trigger={<ActionButton label="Clear Seasons" theme="orange" />}
                    />
                </div>

                {/* 3. Maintenance / Seed */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2">Maintenance</h3>

                    <DestructiveActionDialog
                        title="Seed Default Pitches"
                        description="Inserts the 15 default pitches (001-205). Will fail if pitches already exist (IDs clash)."
                        confirmKeyword="SEED"
                        actionFn={seedPitchesAction}
                        theme="green"
                        trigger={<ActionButton label="Seed Pitches" theme="green" />}
                    />

                    <DestructiveActionDialog
                        title="Seed Default Seasons"
                        description="Inserts default seasons (Low, Medium, High). Will fail if IDs clash."
                        confirmKeyword="SEED"
                        actionFn={seedSeasonsAction}
                        theme="green"
                        trigger={<ActionButton label="Seed Seasons" theme="green" />}
                    />

                    <div className="pt-2 border-t border-gray-800 mt-2 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Select Tables</span>
                            <button
                                onClick={toggleAll}
                                className="text-[9px] text-blue-400 hover:text-blue-300 underline"
                            >
                                {selectedTables.length === allAvailableTables.length ? 'Deselect All' : 'Select All'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-1 max-h-[120px] overflow-y-auto pr-1 custom-scrollbar">
                            {allAvailableTables.map(table => (
                                <label
                                    key={table}
                                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-800/50 p-1 rounded group transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedTables.includes(table)}
                                        onChange={() => toggleTable(table)}
                                        className="hidden"
                                    />
                                    {selectedTables.includes(table) ? (
                                        <CheckSquare className="h-3 w-3 text-blue-500" />
                                    ) : (
                                        <Square className="h-3 w-3 text-gray-600 group-hover:text-gray-400" />
                                    )}
                                    <span className={`text-[10px] truncate ${selectedTables.includes(table) ? 'text-gray-300' : 'text-gray-500'}`}>
                                        {table}
                                    </span>
                                </label>
                            ))}
                        </div>

                        <button
                            onClick={handleBackup}
                            disabled={isBackingUp || selectedTables.length === 0}
                            className={`w-full py-2 px-3 rounded border text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2
                                ${isBackingUp || selectedTables.length === 0
                                    ? 'bg-gray-800 text-gray-500 border-gray-700 opacity-50 cursor-not-allowed'
                                    : 'text-blue-400 border-blue-500/30 hover:bg-blue-500/10'}`}
                        >
                            {isBackingUp ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                                <Download className="h-3 w-3" />
                            )}
                            {isBackingUp ? 'Generating...' : `Backup ${selectedTables.length} Tables`}
                        </button>
                    </div>
                </div>



                {/* 4. Danger Zone */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-red-900 uppercase tracking-widest border-b border-red-900/20 pb-2">Danger Zone</h3>

                    <DestructiveActionDialog
                        title="System Factory Reset"
                        description={
                            <div className="space-y-2">
                                <p>Perform a full factory reset. This is destructive.</p>
                                <ul className="list-disc pl-4 space-y-1 text-red-400">
                                    <li>Deletes EVERYTHING</li>
                                    <li>Restores Default Configuration</li>
                                </ul>
                            </div>
                        }
                        confirmKeyword="RESET"
                        actionFn={resetSystemAction}
                        theme="red"
                        trigger={
                            <button className="w-full py-2 px-3 rounded bg-red-900/20 border border-red-500/50 text-red-500 hover:bg-red-900/40 hover:text-red-400 text-[10px] font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(220,38,38,0.15)] animate-pulse hover:animate-none">
                                [ SYSTEM RESET ]
                            </button>
                        }
                    />
                </div>

            </div>
        </div>
    );
}
