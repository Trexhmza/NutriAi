-- Migration: Strip macros, keep calories only
-- Run in Supabase SQL Editor

-- 1. Drop macro columns from meals (data lost; OK since we're starting fresh)
ALTER TABLE meals DROP COLUMN IF EXISTS protein;
ALTER TABLE meals DROP COLUMN IF EXISTS carbs;
ALTER TABLE meals DROP COLUMN IF EXISTS fats;

-- 2. Drop macro target columns from user_goals
ALTER TABLE user_goals DROP COLUMN IF EXISTS protein_target;
ALTER TABLE user_goals DROP COLUMN IF EXISTS carbs_target;
ALTER TABLE user_goals DROP COLUMN IF EXISTS fats_target;

-- 3. Add goal_calories column (computed: tdee * goal multiplier)
ALTER TABLE user_goals ADD COLUMN IF NOT EXISTS goal_calories INT;
UPDATE user_goals SET goal_calories = CASE goal
  WHEN 'lose' THEN ROUND(tdee * 0.8)
  WHEN 'gain' THEN ROUND(tdee * 1.15)
  ELSE tdee
END WHERE goal_calories IS NULL;
ALTER TABLE user_goals ALTER COLUMN goal_calories SET NOT NULL;

-- 4. Drop unused tables (no longer referenced by code)
DROP TABLE IF EXISTS dashboard_data;
DROP TABLE IF EXISTS agent_chats;
