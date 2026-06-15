-- Run entire file in Supabase SQL Editor

-- 1. TABLES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS meals (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  calories INTEGER NOT NULL,
  meal_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  meal_slot TEXT DEFAULT 'snack' CHECK (meal_slot IN ('breakfast', 'lunch', 'dinner', 'snack')),
  tag TEXT DEFAULT 'Meal',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS weights (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weight DECIMAL(5,1) NOT NULL,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, log_date)
);

-- dashboard_data table removed (unused)

CREATE TABLE IF NOT EXISTS agent_configs (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  llm_provider TEXT DEFAULT 'openai',
  llm_model TEXT DEFAULT 'gpt-4o-mini',
  api_key TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- agent_chats table removed (chat system removed)

CREATE TABLE IF NOT EXISTS user_goals (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  age INT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  height_cm DECIMAL(5,1) NOT NULL,
  weight_kg DECIMAL(5,1) NOT NULL,
  activity_level TEXT NOT NULL CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  goal TEXT NOT NULL CHECK (goal IN ('lose', 'maintain', 'gain')),
  tdee INT NOT NULL,
  goal_calories INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. AUTO-CREATE PROFILE ON SIGNUP
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 3. ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE weights ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;

-- Profiles: users read/update own; insert handled by trigger
DROP POLICY IF EXISTS "profiles_own_select" ON profiles;
DROP POLICY IF EXISTS "profiles_own_update" ON profiles;
CREATE POLICY "profiles_own_select" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_own_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Meals: full CRUD on own data
DROP POLICY IF EXISTS "meals_own_all" ON meals;
CREATE POLICY "meals_own_all" ON meals FOR ALL USING (auth.uid() = user_id);

-- Weights: full CRUD on own data
DROP POLICY IF EXISTS "weights_own_all" ON weights;
CREATE POLICY "weights_own_all" ON weights FOR ALL USING (auth.uid() = user_id);

-- Agent config: own read/update
DROP POLICY IF EXISTS "agent_configs_own_select" ON agent_configs;
DROP POLICY IF EXISTS "agent_configs_own_upsert" ON agent_configs;
DROP POLICY IF EXISTS "agent_configs_own_update" ON agent_configs;
CREATE POLICY "agent_configs_own_select" ON agent_configs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "agent_configs_own_upsert" ON agent_configs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "agent_configs_own_update" ON agent_configs FOR UPDATE USING (auth.uid() = user_id);

-- User goals: own read/update/insert
DROP POLICY IF EXISTS "user_goals_own_select" ON user_goals;
DROP POLICY IF EXISTS "user_goals_own_upsert" ON user_goals;
DROP POLICY IF EXISTS "user_goals_own_update" ON user_goals;
CREATE POLICY "user_goals_own_select" ON user_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_goals_own_upsert" ON user_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_goals_own_update" ON user_goals FOR UPDATE USING (auth.uid() = user_id);

-- 4. INDEXES
CREATE INDEX IF NOT EXISTS idx_meals_user_date ON meals(user_id, meal_time DESC);
CREATE INDEX IF NOT EXISTS idx_weights_user_date ON weights(user_id, log_date DESC);
