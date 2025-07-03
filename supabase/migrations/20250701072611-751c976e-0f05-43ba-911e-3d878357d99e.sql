
-- Create user profiles table (extending the existing one)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS skills text[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS education text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS work_experience text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS resume_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text;

-- Create projects table
CREATE TABLE public.projects (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  required_skills text[] NOT NULL DEFAULT '{}',
  duration text NOT NULL,
  team_size text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  owner_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create project applications table
CREATE TABLE public.project_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  applicant_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  message text,
  applied_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(project_id, applicant_id)
);

-- Create notifications table
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security on new tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles (only create if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can view all profiles') THEN
        CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can insert own profile') THEN
        CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;
END $$;

-- RLS Policies for projects
CREATE POLICY "Anyone can view projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Users can create projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own projects" ON public.projects FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own projects" ON public.projects FOR DELETE USING (auth.uid() = owner_id);

-- RLS Policies for project applications
CREATE POLICY "Users can view applications for their projects" ON public.project_applications FOR SELECT USING (
  auth.uid() IN (
    SELECT owner_id FROM public.projects WHERE id = project_id
  ) OR auth.uid() = applicant_id
);
CREATE POLICY "Users can create applications" ON public.project_applications FOR INSERT WITH CHECK (auth.uid() = applicant_id);
CREATE POLICY "Project owners can update applications" ON public.project_applications FOR UPDATE USING (
  auth.uid() IN (
    SELECT owner_id FROM public.projects WHERE id = project_id
  )
);

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);
