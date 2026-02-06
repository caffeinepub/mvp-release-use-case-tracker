# MVP Release Use Case Tracker

A table-first application for managing Use Cases, Releases, and Phases with Airtable-like interface, inline editing, filtering, and unrestricted access during testing phase.

## Data Models

### Phase
- `phase_id`: Unique string identifier (e.g., Phase-1, Phase-2)
- `phase_name`: String
- `phase_goal`: String description
- `target_date`: Date or text field
- `status`: Enum (Planned, In Progress, Completed)
- `release_id`: Required string that must match existing Release

### Release
- `release_id`: Unique string identifier (e.g., MVP-0, MVP-1)
- `release_name`: String
- `release_goal`: String description
- `target_date`: Date or text field
- `status`: Enum (Planned, In Progress, Released)

### UseCase
- `uc_id`: Auto-generated unique string (UC-001, UC-002, etc.)
- `title`: String
- `description`: Long text field
- `phase_id`: Required string that must match existing Phase
- `mvp_release_id`: Required string that must match existing Release
- `priority`: Enum (P0, P1, P2, P3)
- `status`: Enum (Proposed, Approved, In Build, Test, Done, Deferred)
- `value`: Enum (High, Med, Low)
- `effort`: Enum (S, M, L)
- `owner`: String
- `tags`: Comma-separated string
- `created_date`: Auto-generated timestamp
- `last_updated`: Auto-updated on save

### AppConfig
Single configuration record containing:
- `is_released`: Boolean (default false)
- `admin_passcode`: String (default "admin123")
- `version`: String (default "0.1")

## Authentication & Permissions - Unrestricted Testing Mode

### Complete Access Override
- **All permission checks are completely bypassed** across the entire application
- **All users have unrestricted access** to create, update, and delete Phases, Releases, and Use Cases
- **No authentication or admin session requirements** for any operations
- All UI elements (buttons, forms, inline editing) are permanently enabled for all users
- Backend authorization functions allow all operations without restriction

## User Interface

### Use Cases Screen (Primary)
- Top navigation bar with app title, global search, "Add Use Case" button, "Admin" link, "Releases" navigation, and "Phases" navigation
- Phase information display: Show "Phase-1 Rule: If it doesn't help a tired parent remember this week, it doesn't belong." when viewing Phase "New Mother / Father"
- Left sidebar with collapsible filter panel
- Main grid with inline editing capabilities:
  - Dropdown fields for `phase_id` (showing Phase Name as label), `mvp_release_id`, `priority`, `status`, `value`, `effort`
  - Text editing for `title`, `owner`, `tags`
  - Description field opens detail panel for editing
  - Add new row functionality
  - Autosave on cell blur with `last_updated` auto-update
  - Phase reassignment via dropdown with immediate persistence and React Query updates
- Column order: `uc_id` (readonly), `title`, `phase_id`, `mvp_release_id`, `priority`, `status`, `effort`, `value`, `owner`, `tags`, `last_updated`
- Filter chips for Phase, Release, Status, Priority, Owner
- Search functionality across title, description, tags, owner
- Sorting by priority, status, last_updated, release, phase
- Right-side detail panel with Save, Duplicate, Delete buttons (always enabled)
- Detail panel includes `phase_id` dropdown for reassignment with immediate persistence
- Validation ensures `phase_id` and `mvp_release_id` are always filled
- New Use Cases default to: priority=P2, status=Proposed, value=Med, effort=M

### Releases Screen
- Same grid-style interface as Use Cases
- Inline editing for all Release fields
- All editing capabilities permanently enabled

### Phases Screen
- Same grid-style interface as Use Cases and Releases
- Inline editing for all Phase fields including `release_id` dropdown
- Phase reassignment to different releases via dropdown with immediate persistence and React Query updates
- All editing capabilities permanently enabled
- Column order: `phase_id`, `phase_name`, `phase_goal`, `target_date`, `status`, `release_id`
- Detail panel includes `release_id` dropdown for reassignment with immediate persistence

### Admin/Settings Screen
- Display current mode (Pre-release or Released)
- Admin passcode input field for session activation
- Admin-only controls:
  - Toggle `AppConfig.is_released` setting
  - Change `AppConfig.admin_passcode`
- Show "Admin session active" indicator when applicable

### Optional Dashboard
- Simple count displays by status and by release
- Simple count displays by phase

## Backend Requirements

The backend must store:
- All Phase records with CRUD operations
- All Release records with CRUD operations
- All UseCase records with CRUD operations
- Single AppConfig record with update operations
- Auto-generation of unique IDs for new records
- Validation that `phase_id` references existing Phase
- Validation that `mvp_release_id` references existing Release
- Validation that Phase `release_id` references existing Release
- Update operations for reassigning Use Cases to different Phases
- Update operations for reassigning Phases to different Releases
- Automatic `last_updated` timestamp updates on all modifications

### Initial Data Population - Complete Seed Dataset
The backend must initialize with the following complete dataset for live deployment:

#### Default Releases
1. `release_id`: "Phase-1-UC", `release_name`: "Phase 1 Use Cases", `release_goal`: "", `target_date`: "", `status`: "Planned"
2. `release_id`: "Phase-2-UC", `release_name`: "Phase 2 Use Cases", `release_goal`: "", `target_date`: "", `status`: "Planned"
3. `release_id`: "Phase-3-UC", `release_name`: "Phase 3 Use Cases", `release_goal`: "", `target_date`: "", `status`: "Planned"
4. `release_id`: "Phase-4-UC", `release_name`: "Phase 4 Use Cases", `release_goal`: "", `target_date`: "", `status`: "Planned"

#### Default Phases
1. `phase_id`: "New-Mother-Father", `phase_name`: "New Mother / Father", `phase_goal`: "Phase-1 Rule: If it doesn't help a tired parent remember this week, it doesn't belong.", `target_date`: "", `status`: "Planned", `release_id`: "Phase-1-UC"
2. `phase_id`: "Early-Growth", `phase_name`: "Early Growth (6–24 months)", `phase_goal`: "Phase 2 explores shared media and gentle system prompts that sustain parents through early growth while enabling meaningful collaboration.", `target_date`: "", `status`: "Planned", `release_id`: "Phase-2-UC"
3. `phase_id`: "Structure-Meaning", `phase_name`: "Structure & Meaning", `phase_goal`: "Phase 3 introduces family-friendly structure and meaning layers — cultural, data, and multi-child views.", `target_date`: "", `status`: "Planned", `release_id`: "Phase-3-UC"
4. `phase_id`: "Legacy-Scale", `phase_name`: "Legacy & Scale", `phase_goal`: "Phase 4 extends the experience to legacy, data, and scale-oriented features for full lifecycle and generational continuity.", `target_date`: "", `status`: "Planned", `release_id`: "Phase-4-UC"

#### Default Use Cases

**Phase 1 - New Mother / Father** (all with `phase_id`: "New-Mother-Father", `mvp_release_id`: "Phase-1-UC", `priority`: "P1", `status`: "Proposed", `value`: "Med", `effort`: "M"):
1. `title`: "Create Baby Timeline", `owner`: "Parent", `description`: "Create a baby profile with name + DOB", `tags`: "Entry point, emotional anchor"
2. `title`: "Add First Moment", `owner`: "Parent", `description`: "Add photo + short note ('First kick', 'First night home')", `tags`: "Instant value"
3. `title`: "Auto-Chronological Placement", `owner`: "System", `description`: "Moment placed by date automatically", `tags`: "Reduces thinking"
4. `title`: "View Timeline (Scroll)", `owner`: "Parent", `description`: "Horizontally scroll baby's life", `tags`: "Emotional payoff"
5. `title`: "Add Thought Without Photo", `owner`: "Parent", `description`: "Capture feelings at 3am", `tags`: "Low friction journaling"
6. `title`: "Edit Moment (basic)", `owner`: "Parent", `description`: "Fix date or caption", `tags`: "Trust in system"
7. `title`: "Share Timeline (read-only link)", `owner`: "Parent → Family", `description`: "Share baby timeline with grandparents", `tags`: "Viral surface"
8. `title`: "Today Prompt", `owner`: "System → Parent", `description`: "Gentle prompt: 'Want to remember today?'", `tags`: "Habit seed"
9. `title`: "Private by Default", `owner`: "System", `description`: "No public sharing", `tags`: "Psychological safety"

**Phase 2 - Early Growth (6–24 months)** (all with `phase_id`: "Early-Growth", `mvp_release_id`: "Phase-2-UC", `priority`: "P2", `status`: "Proposed", `value`: "Med", `effort`: "M"):
1. `title`: "Invite Editor (Grandparent)", `owner`: "Parent", `description`: "Allow others to add moments", `tags`: "Reduces burden"
2. `title`: "Inbox for Shared Media", `owner`: "System", `description`: "Grandma uploads photos", `tags`: "Prevents clutter"
3. `title`: "Milestone To‑Dos", `owner`: "System", `description`: "'First smile', 'First steps'", `tags`: "Guidance"
4. `title`: "Notification Reminders", `owner`: "System", `description`: "'You haven't added in a while'", `tags`: "Retention"
5. `title`: "Simple Categorization", `owner`: "Parent", `description`: "Tag as 'Firsts', 'Medical', etc.", `tags`: "Later retrieval"
6. `title`: "Month / Year Markers", `owner`: "System", `description`: "Visual time segmentation", `tags`: "Cognitive clarity"

**Phase 3 - Structure & Meaning** (all with `phase_id`: "Structure-Meaning", `mvp_release_id`: "Phase-3-UC", `priority`: "P3", `status`: "Proposed", `value`: "Med", `effort`: "M"):
1. `title`: "Religious / Cultural Overlays", `owner`: "Parent", `description`: "Baptism, holidays", `tags`: ""
2. `title`: "Height / Weight Data", `owner`: "Parent", `description`: "Growth tracking", `tags`: ""
3. `title`: "School Years", `owner`: "Parent", `description`: "Timeline chapters", `tags`: ""
4. `title`: "Multi‑Child Views", `owner`: "Parent", `description`: "Compare timelines", `tags`: ""
5. `title`: "Role Permissions", `owner`: "System", `description`: "Creator / Editor / Viewer", `tags`: ""

**Phase 4 - Legacy & Scale** (all with `phase_id`: "Legacy-Scale", `mvp_release_id`: "Phase-4-UC", `priority`: "P4", `status`: "Proposed", `value`: "Med", `effort`: "M"):
1. `title`: "Analytics ('You captured 312 moments')", `owner`: "Parent", `description`: "Emotional stats", `tags`: ""
2. `title`: "Export / Print", `owner`: "Parent", `description`: "Physical keepsakes", `tags`: ""
3. `title`: "Child Access (Teen/Adult)", `owner`: "Child", `description`: "Ownership transfer", `tags`: ""
4. `title`: "AI Summaries", `owner`: "System", `description`: "Year‑in‑review stories", `tags`: ""
5. `title`: "Localization", `owner`: "System", `description`: "Global adoption", `tags`: ""

### Unrestricted Testing Mode Authorization
- **Completely bypass all permission checks** in all backend functions
- **Ignore `AppConfig.is_released` state** for all operations
- **Ignore admin session requirements** for all operations
- Allow unrestricted access to all CRUD operations without any authorization barriers
- Maintain data validation to ensure referential integrity
- Prevent all "Unauthorized" and permission-related errors

### AppConfig Auto-Initialization
The backend must automatically initialize AppConfig with default values if it's null when any CRUD operation or permission check calls `getAppConfigOrTrap()`. This self-initialization occurs once at runtime startup or the first time `getAppConfigOrTrap()` runs to prevent users from being blocked by "AppConfig must be initialized first" errors.

Default initialization values:
- `is_released = false`
- `admin_passcode = "admin123"`
- `version = "0.1"`

## Frontend Features

- All UI elements permanently enabled and accessible
- All buttons (Add, Edit, Delete, Save, Duplicate) always functional
- All form fields and inline editing always enabled
- Autosave feedback indicators
- Responsive grid tables with fluid interactions
- Efficient data querying and updates with React Query integration
- Global search and filtering capabilities
- Inline editing with immediate feedback and persistence
- Phase selection and validation in Use Case forms with reassignment capabilities
- Release selection and validation in Phase forms with reassignment capabilities
- Display phase rule information when viewing "New Mother / Father" phase
- Real-time updates across grids and filters when reassignments occur
- App content language: English
