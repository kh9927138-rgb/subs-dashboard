const STORAGE_KEY = 'subs-dashboard:v1';

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return {
      selected: Array.isArray(parsed.selected) ? parsed.selected : [],
      customSubs: Array.isArray(parsed.customSubs) ? parsed.customSubs : [],
      prices: parsed.prices && typeof parsed.prices === 'object' ? parsed.prices : {},
    };
  } catch {
    return null;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable (private browsing, quota exceeded, etc.) — skip persisting
  }
}
