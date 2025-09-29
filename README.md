
# RANKIFY

<img src="https://github.com/JXP25/rankify/blob/main/public/logo.png" width="150"/>

This platform allows users to upload their resumes and track their review status, while an admin panel allows reviewers to score and provide feedback.

**Live Demo:** [https://rankify.jxp.codes]

## Features

- **User Dashboard:** Upload resumes and view the current review status (Pending, Approved, Needs Revision, etc.).
- **Admin Panel:** View all submitted resumes, update their status, assign scores, and add notes.
- **Secure Authentication:** Magic link sign-in for passwordless authentication.
- **File Management:** Secure PDF uploads, storage, and access control using Supabase Storage.
- **UI:** A clean, responsive interface built with Tailwind CSS.

## Tech Stack

- **Framework:** Next.js (with App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Backend & DB:** Supabase (Auth, Postgres, Storage)
- **File Upload:** Dropzone for drag-and-drop file uploads
- **Linter:** ESLint
- **Package Manager:** pnpm

## Design Decisions & Tech Choices

### Why Supabase?

The assignment requirements were exceptionally well-suited for Supabase's feature set, making it the natural choice for this project:

**Authentication System:**

- Supabase Auth provides out-of-the-box magic link authentication, eliminating the need to build custom auth flows
- Built-in user management with secure session handling
- Role-based access control (RBAC) for candidate vs reviewer permissions
- No need for additional authentication libraries or custom JWT handling

**Database & Storage:**

- **PostgreSQL:** Supabase's managed PostgreSQL instance handles all data persistence with automatic backups
- **File Storage:** Supabase Storage provides secure file uploads with built-in access control policies
- **Real-time capabilities:** Built-in real-time subscriptions for live status updates
- **Row Level Security (RLS):** Database-level security ensures users only access their own data

**Developer Experience:**

- Single backend service reduces complexity and deployment overhead
- Global TypeScript types from database schema
- Built-in dashboard for database management and user administration
- Seamless integration with Next.js through official SDK

### File Upload Strategy

**Dropzone Integration:**

- Dropzone provides an intuitive drag-and-drop interface for resume uploads
- Built-in file validation (customized to PDF only, size limits)
- Progress indicators and error handling
- Mobile-responsive touch support

**Storage Architecture:**

- Files stored in Supabase Storage buckets with organized folder structure
- Secure URLs with time-based access tokens
- Automatic file compression and optimization
- Direct upload to storage (no server middleware required)

### Frontend Architecture

**Next.js App Router:**

- Server-side rendering for better SEO and initial load performance
- Middleware for authentication checks and route protection
- Optimized bundle splitting and code organization

**Component Structure:**

- Modular component architecture with clear separation of concerns
- Separate layouts for candidate and reviewer dashboards
- Reusable UI components built with Tailwind CSS
- Type-safe props and state management

## Future Improvements

### Short-term Enhancements

- **Bulk operations:** Allow candidates to process multiple resumes simultaneously on paid basis
- **Export functionality:** CSV/Excel export of review data and analytics

### Medium-term Features

- **Advanced search & filtering:** Full-text search across resume content and metadata
- **Template system:** Customizable review templates and scoring rubrics

### Long-term Vision

- **Advanced analytics:** Dashboard with hiring metrics, time-to-hire analytics, and performance insights
- **Collaborative reviews:** Multi-reviewer workflows with consensus scoring

### Technical Improvements

- **Advanced monitoring:** Application performance monitoring and error tracking
- **Automated testing:** Comprehensive test suite with E2E testing

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or later)
- npm, pnpm
- A Supabase account (free tier available)

### Supabase Setup

This project relies heavily on Supabase for authentication, database, and file storage. You'll need to set up a Supabase project first:

1. **Create a Supabase Project:**

   - Go to [supabase.com](https://supabase.com) and create a new account
   - Create a new project and wait for it to be provisioned
   - Note your project URL and anon key from the project settings

2. **Database Setup:**

   - The database schema is managed through migrations in the `supabase/migrations/` folder
   - Run the initial migration to set up tables for users, resumes, and reviews
   - Enable Row Level Security (RLS) policies for secure data access

3. **Storage Setup:**
   - Create a storage bucket named `resumes` for file uploads
   - Configure bucket policies to allow authenticated users to upload files
   - Set up appropriate access controls for file retrieval

### Local Development Installation

1.  **Clone the repository:**

    ```sh
    git clone [https://github.com/JXP25/rankify](https://github.com/JXP25/rankify)
    cd rankify
    ```

2.  **Install pnpm:**

    ```sh
    corepack enable pnpm
    ```

3.  **Install dependencies:**

    ```sh
    pnpm install
    ```

4.  **Set up environment variables:**

    - Create a copy of the example environment file:
      ```sh
      cp .env.example .env.local
      ```
    - Log in to your Supabase project and find your **Project URL** and **`anon` public key** in _Project Settings > API_.
    - Add these keys to your `.env.local` file:
      ```env
      NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=YOUR_SUPABASE_ANON_KEY
      ```

5.  **Run the development server:**
    ```sh
    pnpm dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Key Integration Points

**Authentication Flow:**

- Magic link authentication is handled entirely by Supabase Auth
- Users are automatically redirected after email verification
- Session management is handled through Supabase client-side and server-side helpers

**File Upload Process:**

- Dropzone handles the frontend file selection and validation
- Files are uploaded directly to Supabase Storage using the storage API
- Upload progress and error handling are managed through custom hooks

**Data Flow:**

- Real-time capabilities are built-in and implemented.
- Row Level Security ensures data isolation between users

---

## Deployment

This application is deployed on [Vercel](https://vercel.com). The production build is created using the standard `npx next build` command.
