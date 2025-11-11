-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT,
  department_id UUID,
  role TEXT,
  status TEXT DEFAULT 'active',
  permissions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create departments table
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create financial_permissions table
CREATE TABLE IF NOT EXISTS public.financial_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  permission_type TEXT NOT NULL,
  module TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create analytics_data table
CREATE TABLE IF NOT EXISTS public.analytics_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  subcategory TEXT,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC,
  metric_date DATE NOT NULL,
  additional_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key for profiles
ALTER TABLE public.profiles 
  ADD CONSTRAINT profiles_department_id_fkey 
  FOREIGN KEY (department_id) 
  REFERENCES public.departments(id) 
  ON DELETE SET NULL;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can insert profiles" ON public.profiles FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete profiles" ON public.profiles FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for departments
CREATE POLICY "Users can view departments" ON public.departments FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage departments" ON public.departments FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for financial_permissions
CREATE POLICY "Users can view their permissions" ON public.financial_permissions FOR SELECT USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage permissions" ON public.financial_permissions FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for analytics_data
CREATE POLICY "Users can view analytics" ON public.analytics_data FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can insert analytics" ON public.analytics_data FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage analytics" ON public.analytics_data FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_departments_updated_at
  BEFORE UPDATE ON public.departments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();