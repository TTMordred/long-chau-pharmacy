
-- Create cms_health_posts table
CREATE TABLE IF NOT EXISTS cms_health_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text,
  category text,
  tags text[],
  featured_image_url text,
  status text DEFAULT 'draft'::text,
  author_id uuid NOT NULL,
  published_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Add foreign key constraint for author_id
ALTER TABLE cms_health_posts 
ADD CONSTRAINT fk_cms_health_posts_author_id 
FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index on slug for performance
CREATE INDEX IF NOT EXISTS idx_cms_health_posts_slug ON cms_health_posts(slug);

-- Create index on status for performance
CREATE INDEX IF NOT EXISTS idx_cms_health_posts_status ON cms_health_posts(status);

-- Create index on category for performance
CREATE INDEX IF NOT EXISTS idx_cms_health_posts_category ON cms_health_posts(category);

-- Create index on published_at for performance
CREATE INDEX IF NOT EXISTS idx_cms_health_posts_published_at ON cms_health_posts(published_at);
