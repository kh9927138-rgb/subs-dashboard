import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import HeroStat from './components/HeroStat.jsx';
import SearchFilterBar from './components/SearchFilterBar.jsx';
import AddCustomForm from './components/AddCustomForm.jsx';
import SubscriptionList from './components/SubscriptionList.jsx';
import SummaryBar from './components/SummaryBar.jsx';
import { useDarkMode } from './hooks/useDarkMode.js';
import { subscriptions } from './data/subscriptions.js';
import { loadState, saveState } from './lib/storage.js';

const CUSTOM_COLOR = '#5B4FE8';
const ALL_CATEGORY = '전체';

export default function App() {
  const { theme, toggleTheme } = useDarkMode();
  const [saved] = useState(loadState);
  const [selected, setSelected] = useState(() => saved?.selected ?? []);
  const [customSubs, setCustomSubs] = useState(() => saved?.customSubs ?? []);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);
  const [prices, setPrices] = useState(() => {
    const defaults = Object.fromEntries(subscriptions.map(sub => [sub.id, sub.price]));
    return { ...defaults, ...(saved?.prices ?? {}) };
  });

  useEffect(() => {
    saveState({ selected, customSubs, prices });
  }, [selected, customSubs, prices]);

  const allSubs = useMemo(() => [...subscriptions, ...customSubs], [customSubs]);

  const categories = useMemo(() => {
    const seen = new Set();
    allSubs.forEach(sub => seen.add(sub.category));
    return [ALL_CATEGORY, ...seen];
  }, [allSubs]);

  const categoryCounts = useMemo(() => {
    const counts = {};
    allSubs.forEach(sub => {
      counts[sub.category] = (counts[sub.category] || 0) + 1;
    });
    return counts;
  }, [allSubs]);

  const filteredSubs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allSubs.filter(sub => {
      const matchesCategory = activeCategory === ALL_CATEGORY || sub.category === activeCategory;
      const matchesQuery = q === '' || sub.name.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [allSubs, activeCategory, query]);

  const toggle = id => {
    setSelected(prev => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]));
  };

  const updatePrice = (id, value) => {
    setPrices(prev => ({ ...prev, [id]: Number.isFinite(value) ? value : 0 }));
  };

  const addCustom = ({ name, price }) => {
    const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setCustomSubs(prev => [
      ...prev,
      { id, name, plan: '', category: '직접 추가', color: CUSTOM_COLOR, custom: true, url: null, steps: [], tip: '' },
    ]);
    setPrices(prev => ({ ...prev, [id]: price }));
    setSelected(prev => [...prev, id]);
  };

  const removeCustom = id => {
    setCustomSubs(prev => prev.filter(sub => sub.id !== id));
    setSelected(prev => prev.filter(item => item !== id));
    setPrices(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const monthlyTotal = useMemo(
    () => selected.reduce((sum, id) => sum + (prices[id] || 0), 0),
    [selected, prices]
  );

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink dark:bg-canvas-dark dark:text-ink-dark">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <HeroStat count={selected.length} monthlyTotal={monthlyTotal} />

      <SearchFilterBar
        query={query}
        onQueryChange={setQuery}
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        categoryCounts={categoryCounts}
        totalCount={allSubs.length}
      />

      <AddCustomForm onAdd={addCustom} />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 pb-28 sm:pb-8">
        <SubscriptionList
          subs={filteredSubs}
          selected={selected}
          prices={prices}
          onToggle={toggle}
          onPriceChange={updatePrice}
          onRemove={removeCustom}
          query={query}
        />
      </main>

      <SummaryBar count={selected.length} monthlyTotal={monthlyTotal} />
    </div>
  );
}
