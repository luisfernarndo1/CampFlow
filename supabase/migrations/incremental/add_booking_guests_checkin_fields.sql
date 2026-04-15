-- =====================================================
-- MIGRATION: Add full check-in fields to booking_guests
-- Date: 2026-04-15
-- Purpose: The booking_guests table was missing all the
--          residence, document, and detailed anagrafica
--          columns required by the check-in form.
-- =====================================================

-- 1. Anagrafica estesa
ALTER TABLE booking_guests
  ADD COLUMN IF NOT EXISTS first_name VARCHAR(100),
  ADD COLUMN IF NOT EXISTS last_name  VARCHAR(100),
  ADD COLUMN IF NOT EXISTS gender     VARCHAR(10),
  ADD COLUMN IF NOT EXISTS birth_country  VARCHAR(100),
  ADD COLUMN IF NOT EXISTS birth_province VARCHAR(10),
  ADD COLUMN IF NOT EXISTS birth_city    VARCHAR(150),
  ADD COLUMN IF NOT EXISTS citizenship   VARCHAR(100),
  ADD COLUMN IF NOT EXISTS is_head_of_family BOOLEAN NOT NULL DEFAULT false;

-- 2. Residenza
ALTER TABLE booking_guests
  ADD COLUMN IF NOT EXISTS residence_country  VARCHAR(100),
  ADD COLUMN IF NOT EXISTS residence_province VARCHAR(10),
  ADD COLUMN IF NOT EXISTS residence_city     VARCHAR(150),
  ADD COLUMN IF NOT EXISTS residence_zip      VARCHAR(10);

-- 3. Documento identità (campi avanzati)
ALTER TABLE booking_guests
  ADD COLUMN IF NOT EXISTS document_issue_date    DATE,
  ADD COLUMN IF NOT EXISTS document_issuer        VARCHAR(150),
  ADD COLUMN IF NOT EXISTS document_issue_city    VARCHAR(150),
  ADD COLUMN IF NOT EXISTS document_issue_country VARCHAR(100);

-- 4. Veicolo
ALTER TABLE booking_guests
  ADD COLUMN IF NOT EXISTS license_plate VARCHAR(20);

-- 5. Migrate existing data: split full_name -> first_name / last_name (best effort)
UPDATE booking_guests
SET
  first_name = split_part(full_name, ' ', 1),
  last_name  = NULLIF(trim(substring(full_name FROM position(' ' IN full_name) + 1)), '')
WHERE first_name IS NULL AND full_name IS NOT NULL AND full_name <> '';

-- 6. Keep nationality -> citizenship mapping for legacy rows
UPDATE booking_guests
SET citizenship = nationality
WHERE citizenship IS NULL AND nationality IS NOT NULL;

-- Verification query (run after migration):
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'booking_guests' ORDER BY ordinal_position;
