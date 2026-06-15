const NUTRIAI_GROQ_KEY = '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';

const NutriAIAgent = {
  config: {
    apiKey: NUTRIAI_GROQ_KEY
  },

  init() {
    const saved = localStorage.getItem('nutriai_agent_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      this.config.apiKey = parsed.apiKey || NUTRIAI_GROQ_KEY;
    } else {
      this.saveConfig();
    }
  },

  saveConfig() {
    localStorage.setItem('nutriai_agent_config', JSON.stringify(this.config));
  },

  async generateAnalysis(goals, todayMeals, weights) {
    if (!this.config.apiKey) {
      return { analysis: 'No API key configured.', quote: '' };
    }

    const systemPrompt = `You are NutriAI — a concise calorie-focused nutrition analysis AI.

You are given the user's daily calorie target, today's meals, and weight trend data.
Analyze their progress and output ONLY valid JSON with exactly two fields:
1. "analysis": 3-4 sentence calorie-focused summary based ONLY on the data provided. Do not make up numbers. Reference actual values.
2. "quote": A short, motivational fitness/nutrition quote (one sentence).

Rules:
- Never invent data. Only reference what is provided.
- If no meals logged, say so.
- Be encouraging and specific.
- Output ONLY the JSON object, no other text.`;

    const gc = goals?.goalCalories || goals?.tdee || 2000;
    const totalCals = todayMeals.reduce((s, m) => s + (m.calories || 0), 0);

    let mealsText = 'No meals logged today.';
    if (todayMeals.length > 0) {
      const bySlot = { breakfast: [], lunch: [], dinner: [], snack: [] };
      todayMeals.forEach(m => { (bySlot[m.meal_slot] || bySlot.snack).push(m); });
      mealsText = Object.entries(bySlot)
        .filter(([, items]) => items.length)
        .map(([slot, items]) => {
          const slotCal = items.reduce((s, m) => s + m.calories, 0);
          return `${slot}: ${items.map(m => `${m.name} (${m.calories}kcal)`).join(', ')} [${slotCal}kcal total]`;
        }).join('\n');
    }

    let weightText = 'No weight data available.';
    if (weights && weights.length >= 2) {
      const sorted = [...weights].sort((a, b) => new Date(a.log_date || a.date) - new Date(b.log_date || b.date));
      const first = sorted[0].weight;
      const last = sorted[sorted.length - 1].weight;
      const diff = last - first;
      const days = Math.max(1, (new Date(sorted[sorted.length - 1].log_date || sorted[sorted.length - 1].date) - new Date(sorted[0].log_date || sorted[0].date)) / (1000 * 60 * 60 * 24));
      const rate = (diff / days) * 7;
      weightText = `${sorted.length} entries. Start: ${first}kg, Current: ${last}kg, Change: ${diff > 0 ? '+' : ''}${diff.toFixed(1)}kg (${rate.toFixed(2)}kg/week)`;
    }

    const userContent = `## Daily Target
Calories: ${gc} kcal

## Today's Intake
Calories: ${totalCals}/${gc} kcal

## Meals Logged
${mealsText}

## Weight Trend
${weightText}

Analyze this data and output JSON.`;

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContent }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `Groq API error: ${res.status}`);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || '';
      let parsed;
      try {
        parsed = JSON.parse(content);
      } catch {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { analysis: content, quote: '' };
      }
      return {
        analysis: parsed.analysis || 'Analysis generated.',
        quote: parsed.quote || ''
      };
    } catch (err) {
      return { analysis: `Analysis error: ${err.message}`, quote: '' };
    }
  },

  async estimateCaloriesFromImage(imageDataUrl) {
    if (!this.config.apiKey) {
      return { foodName: null, calories: null, error: 'No API key configured.' };
    }

    const instruction = `Examine this food image carefully. Count ALL visible food items and estimate their quantities. Output the total calorie estimate for EVERYTHING shown in the image.
Output ONLY valid JSON with exactly three fields:
1. "foodName": short food description including estimated quantity (e.g. "2 scrambled eggs on 1 slice toast")
2. "calories": integer total calorie estimate for ALL food visible
3. "confidence": "high", "medium", or "low"

Rules:
- Always make your best guess, do not return null
- Pay attention to quantity — more items visible means more calories
- Output ONLY the JSON object, no other text`;

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: instruction },
                { type: 'image_url', image_url: { url: imageDataUrl } }
              ]
            }
          ],
          max_tokens: 300,
          temperature: 0.3
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `Groq API error: ${res.status}`);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || '';
      let parsed;
      try {
        parsed = JSON.parse(content);
      } catch {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
      }

      if (parsed && typeof parsed.calories === 'number') {
        return { foodName: parsed.foodName || 'Unknown food', calories: parsed.calories, confidence: parsed.confidence || 'medium' };
      }
      return { foodName: null, calories: null, confidence: 'low', error: `Could not parse AI response. Raw: ${content.slice(0, 200)}` };
    } catch (err) {
      return { foodName: null, calories: null, error: err.message };
    }
  },

  async estimateCaloriesFromText(foodDescription) {
    if (!this.config.apiKey) {
      return { foodName: null, calories: null, error: 'No API key configured.' };
    }

    const systemPrompt = `You are a food calorie estimation AI. Given a text description, estimate total calories for the EXACT quantity described by the user.
If the user says "12 eggs", estimate for 12 eggs (not 1).
If the user says "a bowl of rice", estimate for one typical bowl.
Always pay attention to quantity words (dozen, bowl, cup, plate, 2, 3, pair, etc.).
Output ONLY valid JSON with exactly three fields:
1. "foodName": concise food name including quantity context (e.g. "12 hard-boiled eggs")
2. "calories": integer total calorie estimate for the EXACT quantity described
3. "confidence": "high", "medium", or "low"

Rules:
- Always make your best guess, do not return null
- Be reasonable with portion sizes
- Output ONLY the JSON object, no other text`;

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Estimate calories for: ${foodDescription}` }
          ],
          max_tokens: 200,
          temperature: 0.3
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `Groq API error: ${res.status}`);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || '';
      let parsed;
      try {
        parsed = JSON.parse(content);
      } catch {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
      }

      if (parsed && typeof parsed.calories === 'number') {
        return { foodName: parsed.foodName || foodDescription, calories: parsed.calories, confidence: parsed.confidence || 'medium' };
      }
      return { foodName: null, calories: null, error: `Could not parse AI response. Raw: ${content.slice(0, 200)}` };
    } catch (err) {
      return { foodName: null, calories: null, error: err.message };
    }
  }
};

NutriAIAgent.init();
