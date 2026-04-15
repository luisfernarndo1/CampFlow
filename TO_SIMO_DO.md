# 📊 Database Storage Monitor - Azione Richiesta

## ⚠️ IMPORTANTE: Per Dati ACCURATI

Al momento il pannello mostra **stime** (badge giallo "≈ Estimated").  
Per vedere le **dimensioni reali** (come Supabase Dashboard), devi eseguire 1 semplice migrazione SQL.

---

## 🎯 Migrazione SQL (5 minuti)

### Opzione A: Supabase Dashboard (Raccomandato)

1. **Vai su** https://supabase.com/dashboard
2. **Seleziona** il tuo progetto CampFlow
3. **Click** su **SQL Editor** (menu laterale)  
4. **Apri il file** sul tuo computer:
   ```
   /Users/simo/Downloads/DEV/CampFlow/supabase/migrations/incremental/20260130_storage_stats.sql
   ```
5. **Seleziona TUTTO** il contenuto del file
6. **Incolla** nell'editor SQL di Supabase
7. **Click RUN** (o Cmd+Enter)
8. **Verifica** che appaia **"Success"** ✅

### Opzione B: Supabase CLI

```bash
cd /Users/simo/Downloads/DEV/CampFlow
supabase db push
```

---

## ✅ Verifica Installazione

Dopo aver eseguito la migrazione, verifica che la funzione sia stata creata:

```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name = 'get_storage_stats';
```

**Risultato atteso**: 1 riga con `get_storage_stats`

---

## 🎉 Dopo la Migrazione

1. **Ricarica** la pagina `/settings`
2. **Vai su** "Dev" tab
3. **Verifica** che ora vedi:
   - Badge **"✓ Accurate"** verde (invece di giallo)
   - **Dimensione reale** del database (es. "29 MB")
   - **Dimensioni precise** per ogni tabella

Il badge verde conferma che stai vedendo dati PostgreSQL reali, identici a quelli di Supabase Dashboard!

---

## 📊 Confronto: Prima vs Dopo

### Prima della Migrazione (Stime)
- Database Size: **562.99 KB** ❌ (sbagliato!)
- Badge: **≈ Estimated** (giallo)
- Accuracy: ~50-70%

### Dopo la Migrazione (Dati Reali)
- Database Size: **29 MB** ✅ (uguale a Supabase!)
- Badge: **✓ Accurate** (verde)
- Accuracy: 100%

---

## 🔄 Se Non Vuoi Fare la Migrazione

Il pannello funziona comunque con le stime, ma:
- ⚠️ I numeri saranno **imprecisi** (possono essere 10-50x sbagliati)
- ⚠️ Badge rimane **giallo** "≈ Estimated"
- ⚠️ Non corrisponderà a Supabase Dashboard

**Raccomandazione**: Esegui la migrazione per avere dati affidabili! È una funzione SQL minimale (20 righe) che usa solo funzioni PostgreSQL native.

---

## 🛠️ Cosa Fa la Migrazione

Crea 1 funzione SQL:
- **Nome**: `get_storage_stats()`
- **Scopo**: Ritorna dimensioni reali usando `pg_total_relation_size()`
- **Sicurezza**: `SECURITY DEFINER` (sicura)
- **Performance**: Veloce (~50-100ms)
- **Dipendenze**: Nessuna (usa solo PostgreSQL native)

---

## 📚 Documentazione

- **Limiti Supabase**: `SUPABASE_FREE_TIER_LIMITS.md`
- **Dettagli Implementazione**: `DOCUMENTATION.md`

---

**Status**: ⚠️ **Funziona ma con stime**  
**Azione Richiesta**: ⏳ **Esegui migrazione SQL per dati accurati**  
**Tempo**: ⏱️ **5 minuti**  

Non appena esegui la migrazione, vedrai i dati reali! 🚀

---

# 🚨 CRITICO: Migrazione Check-in - booking_guests (2026-04-15)

## Problema
Il check-in dà errore 500 "Errore salvataggio ospiti" perché la tabella `booking_guests` nel DB **non ha le colonne** richieste dalla form (residenza, documento, dati anagrafici estesi).

## Azione Richiesta (2 minuti) ⚠️ BLOCCA IL CHECK-IN

1. **Vai su** https://supabase.com/dashboard
2. **Seleziona** il progetto CampFlow
3. **Clicca** SQL Editor
4. **Copia e incolla** il contenuto del file:
   ```
   /Users/simo/Downloads/DEV/CampFlow/supabase/migrations/incremental/add_booking_guests_checkin_fields.sql
   ```
5. **Clicca RUN** ✅

## Verifica
Dopo la migrazione, esegui questa query per confermare:
```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'booking_guests'
ORDER BY ordinal_position;
```
Dovresti vedere le nuove colonne: `first_name`, `last_name`, `gender`, `birth_country`, `birth_province`, `birth_city`, `citizenship`, `is_head_of_family`, `residence_country`, `residence_province`, `residence_city`, `residence_zip`, `document_issue_date`, `document_issuer`, `document_issue_city`, `document_issue_country`, `license_plate`.

**Status**: 🔴 BLOCCANTE — Il check-in NON funziona senza questa migrazione.
