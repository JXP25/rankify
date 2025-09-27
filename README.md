# RANKIFY

This platform allows users to upload their resumes and track their review status, while an admin panel allows reviewers to score and provide feedback.

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
- **Linter:** ESLint
- **Package Manager:** pnpm

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or later)
- npm, pnpm

### Installation

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

3.  **Set up environment variables:**
    -   Create a copy of the example environment file:
        ```sh
        cp .env.example .env.local
        ```
    -   Log in to your Supabase project and find your **Project URL** and **`anon` public key** in *Project Settings > API*.
    -   Add these keys to your `.env.local` file:
        ```env
        NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
        NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
        ```

4.  **Run the development server:**
    ```sh
    pnpm dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## Deployment

This application is deployed on [Vercel](https://vercel.com). The production build is created using the standard `npx next build` command.

**Live Demo:** [https://rankify.jxp.codes]