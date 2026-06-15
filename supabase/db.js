const SUPABASE_URL = 'https://zhbxttscyeyqwzcjyqhc.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ANG7_nFJ2pivwTk0H_7zBg_a5t3K08N';

let _client = null;

function getClient() {
  if (!_client) {
    _client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _client;
}

function calculateTDEE(age, gender, heightCm, weightKg, activityLevel, goal) {
  // Mifflin-St Jeor BMR
  let bmr;
  if (gender === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };
  const tdee = Math.round(bmr * (activityMultipliers[activityLevel] || 1.2));

  const goalAdjustments = { lose: 0.8, maintain: 1, gain: 1.15 };
  const goalCalories = Math.round(tdee * (goalAdjustments[goal] || 1));

  return { tdee, goalCalories };
}

const NutriDB = {
  // ── Auth ──
  async signUp(email, password) {
    const { data, error } = await getClient().auth.signUp({ email, password });
    if (error) throw error;
    return data;
  },

  async signIn(email, password) {
    const { data, error } = await getClient().auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await getClient().auth.signOut();
    if (error) throw error;
  },

  async getUser() {
    const { data: { user } } = await getClient().auth.getUser();
    return user;
  },

  onAuthChange(callback) {
    return getClient().auth.onAuthStateChange(callback);
  },

  // ── User Goals ──
  async getUserGoals() {
    const user = await this.getUser();
    if (!user) return null;
    const { data, error } = await getClient()
      .from('user_goals')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    if (error) throw error;
    if (data) {
      data.goalCalories = data.goal_calories;
    }
    return data;
  },

  async saveUserGoals(input) {
    const user = await this.getUser();
    if (!user) throw new Error('Not logged in');
    const result = calculateTDEE(
      input.age, input.gender, input.heightCm, input.weightKg,
      input.activityLevel, input.goal
    );
    const payload = {
      user_id: user.id,
      age: input.age,
      gender: input.gender,
      height_cm: input.heightCm,
      weight_kg: input.weightKg,
      activity_level: input.activityLevel,
      goal: input.goal,
      tdee: result.tdee,
      goal_calories: result.goalCalories
    };
    const { data, error } = await getClient()
      .from('user_goals')
      .upsert(payload)
      .select()
      .single();
    if (error) throw error;
    return { ...data, goalCalories: result.goalCalories };
  },

  // ── Meals ──
  async getMeals() {
    const user = await this.getUser();
    if (!user) return [];
    const { data, error } = await getClient()
      .from('meals')
      .select('*')
      .eq('user_id', user.id)
      .order('meal_time', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getTodayMeals() {
    const user = await this.getUser();
    if (!user) return [];
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const { data, error } = await getClient()
      .from('meals')
      .select('*')
      .eq('user_id', user.id)
      .gte('meal_time', startOfDay.toISOString())
      .lt('meal_time', endOfDay.toISOString())
      .order('meal_time', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async addMeal(meal) {
    const user = await this.getUser();
    if (!user) throw new Error('Not logged in');
    const now = new Date();
    let mealTime;
    if (meal.mealTime) {
      const [h, m] = meal.mealTime.split(':');
      mealTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), +h, +m).toISOString();
    } else {
      mealTime = now.toISOString();
    }
    const { data, error } = await getClient()
      .from('meals')
      .insert({
        user_id: user.id,
        name: meal.name,
        calories: meal.calories,
        meal_slot: meal.mealSlot || meal.meal_slot || 'snack',
        tag: meal.tag || 'Meal',
        meal_time: mealTime
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteMeal(id) {
    const { error } = await getClient()
      .from('meals')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // ── Weights ──
  async getWeights() {
    const user = await this.getUser();
    if (!user) return [];
    const { data, error } = await getClient()
      .from('weights')
      .select('*')
      .eq('user_id', user.id)
      .order('log_date', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async addWeight(weight, logDate) {
    const user = await this.getUser();
    if (!user) throw new Error('Not logged in');
    const { data, error } = await getClient()
      .from('weights')
      .upsert(
        { user_id: user.id, weight, log_date: logDate },
        { onConflict: 'user_id,log_date' }
      )
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // ── Agent Config ──
  async getAgentConfig() {
    const user = await this.getUser();
    if (!user) return null;
    const { data, error } = await getClient()
      .from('agent_configs')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async saveAgentConfig(config) {
    const user = await this.getUser();
    if (!user) throw new Error('Not logged in');
    const { data, error } = await getClient()
      .from('agent_configs')
      .upsert({
        user_id: user.id,
        llm_provider: config.llmProvider || config.llm_provider || 'openai',
        llm_model: config.llmModel || config.llm_model || 'gpt-4o-mini',
        api_key: config.apiKey || config.api_key || '',
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // ── Calorie History for Charts (last N days including today) ──
  async getCalorieHistory(days) {
    const user = await this.getUser();
    if (!user) return [];
    const now = new Date();
    const since = new Date(now.getFullYear(), now.getMonth(), now.getDate() - days + 1);
    const { data, error } = await getClient()
      .from('meals')
      .select('meal_time, calories')
      .eq('user_id', user.id)
      .gte('meal_time', since.toISOString())
      .order('meal_time', { ascending: true });
    if (error) throw error;

    const fmt = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const byDate = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      byDate[fmt(d)] = 0;
    }
    (data || []).forEach(m => {
      const d = new Date(m.meal_time);
      const day = fmt(d);
      if (byDate[day] !== undefined) byDate[day] += m.calories;
    });
    return Object.entries(byDate).map(([date, cals]) => ({ date, calories: cals }));
  },

  // ── Current week meal summary (Mon-Sun) ──
  async getWeekMeals() {
    const user = await this.getUser();
    if (!user) return [];
    const now = new Date();
    // Monday of current week (getDay: 0=Sun, 1=Mon)
    const mon = new Date(now);
    mon.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    mon.setHours(0, 0, 0, 0);
    // Next Monday
    const nextMon = new Date(mon);
    nextMon.setDate(mon.getDate() + 7);
    const { data, error } = await getClient()
      .from('meals')
      .select('meal_time, calories')
      .eq('user_id', user.id)
      .gte('meal_time', mon.toISOString())
      .lt('meal_time', nextMon.toISOString())
      .order('meal_time', { ascending: true });
    if (error) throw error;

    const fmt = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const byDate = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(mon);
      d.setDate(mon.getDate() + i);
      byDate[fmt(d)] = 0;
    }
    const calByDate = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(mon);
      d.setDate(mon.getDate() + i);
      calByDate[fmt(d)] = 0;
    }
    (data || []).forEach(m => {
      const d = new Date(m.meal_time);
      const day = fmt(d);
      if (byDate[day] !== undefined) byDate[day] += 1;
      if (calByDate[day] !== undefined) calByDate[day] += m.calories || 0;
    });
    // Return array with dayOfWeek (0=Sun, 1=Mon...) and meal count and total calories
    return Object.entries(byDate).map(([date, mealCount]) => {
      const d = new Date(date + 'T00:00:00');
      return { date, dayOfWeek: d.getDay(), mealCount, totalCalories: calByDate[date] || 0, hasMeals: mealCount > 0 };
    });
  },

  // ── Seed Test Data (no-op, test data removed) ──
  async seedTestData() {}
};
