# DOCUMENTATION

## [2026-04-24 19:50]: Global Name Display Standardization
*Details*: Standardized the customer name display format to "Cognome Nome" (Last Name First Name) across the entire application. This change ensures a more professional and sorted view in lists and reports.
*Tech Notes*:
- Modified string interpolations in `GuestCard`, `CheckOutDialog`, `Customers` page, `BookingDetailsDialog`, `GuestForm`, `CheckIn` page, and `CustomerDetailPage`.
- Updated API responses in `api/bookings/[id]/guests`, `api/occupancy`, and `api/occupancy/batch` to use the new naming convention.
- Swapped initials in Avatar displays (e.g., "LC" for "Lastname Customer").
- Build verified with `npm run build`.

## [2026-04-24 19:30]: Booking Modification & Pitch Reassignment
*Details*: Implemented the ability to modify booking dates and reassign pitches directly from the occupancy view.
*Tech Notes*:
- Updated `BookingCreationModal` to support edit mode.
- Modified `/api/availability` to accept `exclude_booking_id`.
- Handled dynamic pricing recalculation during edits.

## [2026-04-24 19:20]: Dependency & Synchronization
*Details*: Performed a major sync with remote repository and resolved environment-related build errors.
*Tech Notes*:
- Git pull --rebase with conflict resolution.
- Installed missing Radix UI and jsPDF dependencies.
- Confirmed build stability.

## [2026-04-25 14:45]: Database Backup Feature (Admin Dashboard)
*Details*: Implemented a database backup/export functionality in the System Monitor (Admin) dashboard. This allows administrators to download the entire application data as a JSON file for security and archiving purposes.
*Tech Notes*:
- Created `generateBackupAction` in `src/app/sys-monitor/login/actions.ts` using `supabaseAdmin`.
- Tables included: `customers`, `bookings`, `booking_guests`, `pitches`, `sectors`, `pricing_seasons`, `customer_groups`, `group_season_configuration`, `group_bundles`, `app_logs`.
- Added "Download Database Backup" button to `DatabaseManagerWidget` with client-side blob download logic.
- UI integrated with `lucide-react` icons and loading states.
- Functionality is restricted to authenticated administrators in `/sys-monitor`.

## [2026-04-25 14:50]: Enhanced Backup with Table Selection
*Details*: Added the ability to select specific database tables for export in the Admin Dashboard.
*Tech Notes*:
- Updated `generateBackupAction` to accept an optional array of table names.
- Added a checklist UI with "Select/Deselect All" functionality in `DatabaseManagerWidget`.
- Dynamic filename generation based on export scope (`full` vs `partial`).
