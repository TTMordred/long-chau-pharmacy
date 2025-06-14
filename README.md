
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/80b2e493-4cb8-44bf-aa57-368e1dbd850a

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/80b2e493-4cb8-44bf-aa57-368e1dbd850a) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Database & Authentication)
- @tanstack/react-query (Data fetching)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/80b2e493-4cb8-44bf-aa57-368e1dbd850a) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Important Application Features

### User Roles & Permissions

This application uses a role-based access system with the following roles:

- **customer** (default) - Can browse products, upload prescriptions, manage their cart
- **pharmacist** - Can review and approve/reject prescriptions
- **admin** - Full access to CMS dashboard and all management features
- **content_manager** - Can manage blog posts and CMS content

#### How to Set User Roles

To assign roles to users, you need to insert records into the `user_roles` table in Supabase:

1. Go to your Supabase Dashboard → SQL Editor
2. Run this query to assign a role:

```sql
INSERT INTO public.user_roles (user_id, role) 
VALUES ('user-uuid-here', 'admin');
```

3. To find user UUIDs, check: Supabase Dashboard → Authentication → Users

#### Example: Make yourself an admin
```sql
-- Replace 'your-user-id-here' with your actual UUID from auth.users
INSERT INTO public.user_roles (user_id, role) 
VALUES ('your-user-id-here', 'admin');
```

### Prescription Management

#### For Customers:
- Upload prescription images or PDFs at `/upload-prescription`
- View status of uploaded prescriptions (pending, approved, rejected)
- Add optional notes for pharmacists
- Search and filter their prescription history

#### For Pharmacists/Admins:
- Access CMS Dashboard at `/cms-dashboard` (requires pharmacist or admin role)
- Review uploaded prescriptions
- Approve or reject prescriptions with notes
- View prescription details and customer information

### Storage Configuration

The application uses Supabase Storage for prescription files. You need to:

1. Create a storage bucket named `prescriptions` in your Supabase project
2. Set appropriate storage policies for file access
3. Ensure the bucket allows uploads from authenticated users

### Authentication

- User registration and login functionality
- Automatic profile creation on signup
- Protected routes that require authentication
- Role-based access to different sections

### CMS Features

- Blog post management (for content managers and admins)
- Page management
- Product catalog management
- Order management
- User management

### Important Notes

- The app requires authentication for most features
- File uploads are limited to 10MB for prescriptions
- Supported prescription formats: JPG, PNG, PDF
- All data is stored securely in Supabase with Row Level Security (RLS)
- Real-time updates using React Query for data synchronization

### Troubleshooting

#### Prescription Upload Issues
- Ensure the `prescriptions` storage bucket exists in Supabase
- Check file size (must be under 10MB)
- Verify file format (JPG, PNG, PDF only)
- Confirm user is authenticated

#### Role Access Issues
- Verify user has the correct role assigned in `user_roles` table
- Check that RLS policies are properly configured
- Ensure user is authenticated before accessing protected routes

#### Database Issues
- All tables use Row Level Security (RLS)
- User data is isolated by user_id
- Foreign key relationships maintain data integrity
