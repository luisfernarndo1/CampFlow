'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Loader2, CalendarIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { toast } from 'sonner';
import { getTodayItaly } from '@/lib/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function ArrivalsReportButton() {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(getTodayItaly());
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/arrivals/print?date=${date}`);
            if (!res.ok) throw new Error('Failed to fetch arrivals');
            const data = await res.json();
            
            generatePDF(date, data.arrivals);
            toast.success('Riepilogo generato con successo!');
            setOpen(false);
        } catch (error) {
            console.error(error);
            toast.error('Errore durante la generazione del riepilogo');
        } finally {
            setLoading(false);
        }
    };

    const generatePDF = (selectedDate: string, arrivals: any[]) => {
        const doc = new jsPDF();
        const parsedDate = new Date(selectedDate);
        const formattedDate = format(parsedDate, 'dd MMMM yyyy', { locale: it });
        
        // Header
        doc.setFontSize(22);
        doc.setTextColor(33, 37, 41);
        doc.text(`Riepilogo Arrivi`, 14, 20);
        
        doc.setFontSize(14);
        doc.setTextColor(108, 117, 125);
        doc.text(`Data: ${formattedDate}  |  Totale prenotazioni in arrivo: ${arrivals.length}`, 14, 28);
        
        doc.setLineWidth(0.5);
        doc.setDrawColor(200, 200, 200);
        doc.line(14, 32, 196, 32);

        let startY = 40;
        
        if (arrivals.length === 0) {
            doc.setFontSize(12);
            doc.text('Nessun arrivo previsto per questa data.', 14, startY);
        }

        arrivals.forEach((booking, idx) => {
            const isCheckedIn = booking.status === 'checked_in';
            const pitchLabel = booking.pitch ? booking.pitch.number : 'N/D';
            const customer = booking.customer || {};
            const headCustName = `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Cliente Sconosciuto';
            
            // Check page break
            if (startY > 250) {
                doc.addPage();
                startY = 20;
            }

            // Booking Header
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text(`Piazzola ${pitchLabel} - ${headCustName}`, 14, startY);
            
            // Guests count badge
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100, 100, 100);
            doc.text(`(${booking.guests_count} ospiti previsti)`, 145, startY);

            startY += 8;
            
            if (!isCheckedIn) {
                // RED TEXT FOR MISSING CHECK IN
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(220, 38, 38); // Red
                doc.text("DATI MANCANTI - CHECK-IN DA EFFETTUARE", 14, startY);
                
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(100, 100, 100);
                doc.text(`Riferimento prenotazione: ${customer.first_name || ''} ${customer.last_name || ''} - Telefono: ${customer.phone || 'N/D'}`, 14, startY + 6);
                
                startY += 18;
            } else {
                // HEAD OF FAMILY DETAILS
                const headGuest = booking.guests?.find((g: any) => g.is_head_of_family) || booking.guests?.[0] || customer;
                const otherGuests = booking.guests?.filter((g: any) => g.id !== headGuest?.id) || [];
                
                const formatD = (d: string) => d ? format(new Date(d), 'dd/MM/yyyy') : 'N/D';
                const addressStr = `${customer.address || ''}, ${customer.residence_city || ''} ${customer.residence_province ? '('+customer.residence_province+')' : ''} ${customer.residence_country || ''}`.trim();
                const docStr = `${(customer.document_type || 'N/D').toUpperCase()} n. ${customer.document_number || 'N/D'} ril. ${formatD(customer.document_issue_date)} da ${customer.document_issuer || 'N/D'} (${customer.document_issue_city || 'N/D'})`;
                
                const headData = [
                    ['Capofamiglia', `${headGuest.first_name || customer.first_name} ${headGuest.last_name || customer.last_name}`],
                    ['Nato a', `${headGuest.birth_city || 'N/D'} il ${formatD(headGuest.birth_date)}`],
                    ['Cittadinanza', `${headGuest.citizenship || 'N/D'}`],
                    ['Residenza', addressStr || 'N/D'],
                    ['Documento', docStr]
                ];

                autoTable(doc, {
                    startY,
                    body: headData,
                    theme: 'plain',
                    styles: { cellPadding: 1, fontSize: 9, minCellHeight: 6 },
                    columnStyles: {
                        0: { fontStyle: 'bold', cellWidth: 35, textColor: [100, 100, 100] },
                        1: { textColor: [0, 0, 0] }
                    },
                    margin: { left: 14 }
                });

                startY = (doc as any).lastAutoTable.finalY + 6;

                // OTHER GUESTS
                if (otherGuests.length > 0) {
                    const guestsHead = [['Nome', 'Cognome', 'Data di Nascita', 'Luogo di Nascita', 'Cittadinanza']];
                    const guestsBody = otherGuests.map((g: any) => [
                        g.first_name || '',
                        g.last_name || '',
                        formatD(g.birth_date),
                        g.birth_city || '',
                        g.citizenship || ''
                    ]);
                    
                    autoTable(doc, {
                        startY,
                        head: guestsHead,
                        body: guestsBody,
                        theme: 'grid',
                        styles: { fontSize: 8 },
                        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
                        margin: { left: 14 }
                    });
                    
                    startY = (doc as any).lastAutoTable.finalY + 12;
                } else {
                    startY += 6;
                }
            }
            
            // Add a separator line if not the last item
            if (idx < arrivals.length - 1) {
                doc.setDrawColor(230, 230, 230);
                doc.line(14, startY - 4, 196, startY - 4);
                startY += 4;
            }
        });
        
        // Save using requested filename format
        const fnameObj = format(parsedDate, 'dd_MMMM_yyyy', { locale: it }).replace(/\s+/g, '_').toLowerCase();
        doc.save(`arrivi_${fnameObj}.pdf`);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 bg-background">
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">Stampa Arrivi</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Genera Riepilogo Arrivi</DialogTitle>
                    <DialogDescription>
                        Seleziona la data per la quale vuoi generare il foglio di riepilogo in formato PDF.
                        Verranno inclusi tutti i dettagli inseriti al check-in.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Data degli arrivi</label>
                        <div className="relative">
                            <Input 
                                type="date" 
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="pl-10"
                            />
                            <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Annulla</Button>
                    <Button onClick={handleGenerate} disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                        Genera PDF
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
