import { useState, useMemo, useEffect } from 'react';
import { 
  Menu as MenuIcon, 
  X, 
  ChevronDown, 
  ChevronLeft, 
  Bell, 
  MessageSquare, 
  Home, 
  Star, 
  Search,
  Sparkles,
  Flame,
  Snowflake,
  LayoutGrid,
  Sun,
  Moon
} from 'lucide-react';
import menuRaw from './data/menu.json';

type Lang = 'tr' | 'en';
type MasterType = 'all' | 'hot' | 'cold';

interface LocalizedString {
  tr: string;
  en: string;
}

interface MenuItem {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  prices: Record<string, string>;
  pricesNum: Record<string, number>;
  spicy?: boolean;
}

interface MenuCategory {
  id: string;
  type: 'hot' | 'cold';
  title: LocalizedString;
  subtitle?: string;
  image: string;
  items: MenuItem[];
}

interface MenuData {
  cafe: string;
  subtitle: string;
  extras: { name: LocalizedString; price: string; priceNum: number }[];
  categories: MenuCategory[];
}

const menuData = menuRaw as unknown as MenuData;

// Progressive Image Loader
function ProgressiveImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-200 dark:bg-slate-800">
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      />
    </div>
  );
}

export function App() {
  const [lang, setLang] = useState<Lang>('tr');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [masterType, setMasterType] = useState<MasterType>('all');
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dark Mode state with persistence
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('qr_menu_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('qr_menu_theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Floating Action Popover
  const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);

  // Garson Çağır state
  const [isWaiterModalOpen, setIsWaiterModalOpen] = useState(false);
  const [waiterCalled, setWaiterCalled] = useState(false);

  // Geri Bildirim state
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  // Categories filtered by HOT / COLD / ALL
  const visibleCategories = useMemo(() => {
    if (masterType === 'all') return menuData.categories;
    return menuData.categories.filter((cat) => cat.type === masterType);
  }, [masterType]);

  // Filtered search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();
    const results: { item: MenuItem; categoryTitle: string }[] = [];
    menuData.categories.forEach((cat) => {
      cat.items.forEach((item) => {
        const name = (lang === 'tr' ? item.name.tr : item.name.en).toLowerCase();
        const desc = (lang === 'tr' ? item.description.tr : item.description.en).toLowerCase();
        if (name.includes(q) || desc.includes(q)) {
          results.push({ item, categoryTitle: lang === 'tr' ? cat.title.tr : cat.title.en });
        }
      });
    });
    return results;
  }, [searchQuery, lang]);

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'} font-sans flex justify-center selection:bg-amber-500 selection:text-white transition-colors duration-200`}>
      {/* Mobile-Frame Container */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 min-h-screen shadow-2xl relative flex flex-col pb-24 border-x border-slate-200 dark:border-slate-800 transition-colors duration-200">
        
        {/* Sticky Header with Frosted Glass Effect */}
        <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 flex items-center justify-between shadow-sm transition-colors">
          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 transition active:scale-95"
            >
              <span className="uppercase">{lang}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            </button>

            {isLangMenuOpen && (
              <div className="absolute left-0 mt-1.5 w-28 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-1 z-50 animate-in fade-in zoom-in-95">
                <button
                  onClick={() => { setLang('tr'); setIsLangMenuOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg ${lang === 'tr' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                  🇹🇷 Türkçe
                </button>
                <button
                  onClick={() => { setLang('en'); setIsLangMenuOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg ${lang === 'en' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                  🇬🇧 English
                </button>
              </div>
            )}
          </div>

          {/* Brand Name & Emblem Logo */}
          <div 
            onClick={() => { setSelectedCategory(null); setSearchQuery(''); setMasterType('all'); }}
            className="cursor-pointer flex items-center gap-2"
          >
            <img 
              src="./logo.png" 
              alt="Indulge Yourself Emblem" 
              className="w-9 h-9 rounded-full object-cover shadow-sm ring-1 ring-slate-900/10 dark:ring-amber-400/20"
            />
            <div className="text-left">
              <h1 className="font-extrabold text-xs tracking-wide text-slate-900 dark:text-slate-100 uppercase">
                {menuData.cafe}
              </h1>
              <p className="text-[9px] text-slate-500 dark:text-slate-400 font-medium">
                {menuData.subtitle}
              </p>
            </div>
          </div>

          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-300 border border-slate-200 dark:border-slate-700 transition active:scale-95"
            aria-label="Toggle Dark Mode"
            title={isDark ? 'Açık Mod' : 'Koyu Mod'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </header>

        {/* Live Search Bar with Amber Ring */}
        <div className="p-3 bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-colors">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'tr' ? 'Menüde ara (Americano, Latte, Frozen...)' : 'Search menu (Americano, Latte, Frozen...)'}
              className="w-full pl-9 pr-8 py-2 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/25 shadow-inner placeholder-slate-400 dark:placeholder-slate-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Physical Board Master Tabs: ALL / HOT DRINKS / COLD DRINKS */}
        {!selectedCategory && !searchQuery && (
          <div className="px-3 pt-3">
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-2xl transition-colors">
              <button
                onClick={() => setMasterType('all')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition active:scale-95 ${
                  masterType === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>{lang === 'tr' ? 'Tümü' : 'All'}</span>
              </button>

              <button
                onClick={() => setMasterType('hot')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition active:scale-95 ${
                  masterType === 'hot'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-950 fill-amber-950" />
                <span>HOT DRINKS</span>
              </button>

              <button
                onClick={() => setMasterType('cold')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition active:scale-95 ${
                  masterType === 'cold'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Snowflake className="w-3.5 h-3.5 text-cyan-950" />
                <span>COLD DRINKS</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-3">
          {/* Search Results Mode */}
          {searchResults ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
                <span>{lang === 'tr' ? 'Arama Sonuçları' : 'Search Results'}</span>
                <span className="font-bold">{searchResults.length}</span>
              </div>
              {searchResults.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  {lang === 'tr' ? 'Eşleşen ürün bulunamadı.' : 'No matching items found.'}
                </div>
              ) : (
                <div className="space-y-2">
                  {searchResults.map(({ item, categoryTitle }) => (
                    <div
                      key={item.id}
                      className="p-3.5 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm transition"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                            {categoryTitle}
                          </span>
                          {item.spicy && (
                            <span className="text-[9px] font-bold text-red-500 bg-red-50 dark:bg-red-950/40 px-1.5 py-0.2 rounded border border-red-200 dark:border-red-800/50">
                              Chili 🌶️
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 mt-1">
                        {lang === 'tr' ? item.name.tr : item.name.en}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                        {lang === 'tr' ? item.description.tr : item.description.en}
                      </p>
                      
                      <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                        {Object.entries(item.prices).map(([size, price]) => (
                          <div
                            key={size}
                            className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 rounded-lg text-xs font-bold text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60"
                          >
                            {size !== 'Tek' && (
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mr-1">
                                {size}
                              </span>
                            )}
                            <span>{price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : selectedCategory ? (
            /* Inside Selected Category View */
            <div className="space-y-4">
              {/* Back button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 transition active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{lang === 'tr' ? 'Kategorilere Dön' : 'Back to Categories'}</span>
                </button>
              </div>

              {/* Category Header Banner with Photo & Skeleton Loader */}
              <div className="relative h-32 rounded-2xl overflow-hidden shadow-md">
                <ProgressiveImage
                  src={selectedCategory.image}
                  alt={lang === 'tr' ? selectedCategory.title.tr : selectedCategory.title.en}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent flex flex-col justify-end p-4 text-white">
                  <div className="inline-block text-[9px] uppercase font-bold tracking-widest text-amber-400 mb-0.5">
                    {selectedCategory.type === 'hot' ? 'HOT DRINKS BOARD' : 'COLD DRINKS BOARD'}
                  </div>
                  <h2 className="font-extrabold text-base tracking-wide uppercase">
                    {lang === 'tr' ? selectedCategory.title.tr : selectedCategory.title.en}
                  </h2>
                  {selectedCategory.subtitle ? (
                    <p className="text-[10px] text-amber-300 font-medium mt-0.5">
                      {selectedCategory.subtitle}
                    </p>
                  ) : (
                    <p className="text-[10px] text-slate-300">
                      {selectedCategory.items.length} {lang === 'tr' ? 'çeşit' : 'options'}
                    </p>
                  )}
                </div>
              </div>

              {/* Category Items List (Clean cards with exact S/M/L prices) */}
              <div className="space-y-2.5">
                {selectedCategory.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:border-amber-400 dark:hover:border-amber-500/50 transition"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        {lang === 'tr' ? item.name.tr : item.name.en}
                      </h3>
                      {item.spicy && (
                        <span className="text-[9px] font-bold text-red-500 bg-red-50 dark:bg-red-950/40 px-1.5 py-0.2 rounded border border-red-200 dark:border-red-800/50">
                          Chili 🌶️
                        </span>
                      )}
                    </div>
                    
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                      {lang === 'tr' ? item.description.tr : item.description.en}
                    </p>
                    
                    <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                      {Object.entries(item.prices).map(([size, price]) => (
                        <div
                          key={size}
                          className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 rounded-lg text-xs font-bold text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60"
                        >
                          {size !== 'Tek' && (
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mr-1">
                              {size}
                            </span>
                          )}
                          <span>{price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* 2-Column Photo Grid */
            <div className="space-y-4 pt-1">
              {/* Active Section Label */}
              <div className="flex items-center justify-between px-1 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                <span>
                  {masterType === 'all' 
                    ? (lang === 'tr' ? 'TÜM MENÜ PANOLARI' : 'ALL MENU BOARDS')
                    : masterType === 'hot'
                    ? 'HOT DRINKS BOARD'
                    : 'COLD DRINKS BOARD'}
                </span>
                <span className="text-slate-400 dark:text-slate-500 text-[10px]">
                  {visibleCategories.length} {lang === 'tr' ? 'kategori' : 'categories'}
                </span>
              </div>

              {/* 2-Column Categories Grid */}
              <div className="grid grid-cols-2 gap-3">
                {visibleCategories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => setSelectedCategory(category)}
                    className="group relative h-40 rounded-2xl overflow-hidden shadow-md cursor-pointer border border-slate-200 dark:border-slate-800 hover:border-amber-500 hover:shadow-lg transition-all duration-200 active:scale-95"
                  >
                    {/* Category Background Image with Skeleton Loader */}
                    <ProgressiveImage
                      src={category.image}
                      alt={lang === 'tr' ? category.title.tr : category.title.en}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Prominent Frosted Glass Temperature Badge (Top-Left) */}
                    <div className="absolute top-2.5 left-2.5 z-10">
                      {category.type === 'hot' ? (
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/30 text-amber-300 border border-amber-400/40 backdrop-blur-md shadow-sm">
                          <Flame className="w-2.5 h-2.5 fill-amber-300" />
                          <span>HOT</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 backdrop-blur-md shadow-sm">
                          <Snowflake className="w-2.5 h-2.5" />
                          <span>COLD</span>
                        </div>
                      )}
                    </div>

                    {/* Dark Enhanced High-Contrast Gradient Bottom Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

                    {/* Category Title Label (Modern Bold Sans-Serif) */}
                    <div className="absolute bottom-2.5 inset-x-2.5 z-10">
                      <span className="text-[12px] font-extrabold text-white uppercase tracking-wider block drop-shadow-md leading-tight">
                        {lang === 'tr' ? category.title.tr : category.title.en}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Extras & Add-ons Box (Strictly Only the 3 Physical Board Items) */}
              <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3.5 mt-2 transition-colors">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>EXTRAS</span>
                  </div>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">+35₺</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {menuData.extras.map((extra, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-center transition">
                      <div className="text-[10px] font-bold text-slate-800 dark:text-slate-200 leading-tight uppercase">
                        {lang === 'tr' ? extra.name.tr : extra.name.en}
                      </div>
                      <div className="text-xs font-black text-amber-600 dark:text-amber-400 mt-1">
                        +{extra.price}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Spacing */}
              <div className="pb-4" />
            </div>
          )}
        </main>

        {/* Floating Action Menu (Bottom Right Circular Button) */}
        <div className="fixed bottom-5 right-5 z-50 max-w-md w-auto">
          {/* Popover Action Menu */}
          {isFabMenuOpen && (
            <div className="mb-3 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-2 animate-in fade-in slide-in-from-bottom-5 duration-200">
              <button
                onClick={() => { setIsWaiterModalOpen(true); setIsFabMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition"
              >
                <Bell className="w-4 h-4 text-red-500" />
                <span>{lang === 'tr' ? 'Garson Çağır' : 'Call Waiter'}</span>
              </button>

              <button
                onClick={() => { setIsFeedbackOpen(true); setIsFabMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition"
              >
                <MessageSquare className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>{lang === 'tr' ? 'Geri Bildirim' : 'Feedback'}</span>
              </button>

              <button
                onClick={() => { setSelectedCategory(null); setSearchQuery(''); setIsFabMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition border-t border-slate-100 dark:border-slate-700 mt-1 pt-2"
              >
                <Home className="w-4 h-4 text-slate-500" />
                <span>{lang === 'tr' ? 'Menüden Çık / Ana Sayfa' : 'Home Menu'}</span>
              </button>
            </div>
          )}

          {/* Red/Crimson Circular FAB */}
          <button
            onClick={() => setIsFabMenuOpen(!isFabMenuOpen)}
            className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-xl shadow-red-600/30 transition active:scale-95"
            aria-label="Menu Actions"
          >
            {isFabMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>

        {/* Garson Çağır Modal */}
        {isWaiterModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 w-full max-w-sm shadow-2xl text-center space-y-3 animate-in fade-in zoom-in-95 border border-slate-200 dark:border-slate-700">
              <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
                <Bell className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                {lang === 'tr' ? 'Garson Çağır' : 'Call Waiter'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {lang === 'tr' 
                  ? 'Masanıza servis görevlisi yönlendirmek istiyor musunuz?' 
                  : 'Would you like to call a waiter to your table?'}
              </p>

              {waiterCalled ? (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold rounded-xl border border-emerald-200 dark:border-emerald-800/50">
                  {lang === 'tr' ? '✓ Garson çağrısı iletildi. Birazdan masanızda olacağız!' : '✓ Waiter called. We will be with you shortly!'}
                </div>
              ) : (
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setIsWaiterModalOpen(false)}
                    className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                  >
                    {lang === 'tr' ? 'İptal' : 'Cancel'}
                  </button>
                  <button
                    onClick={() => {
                      setWaiterCalled(true);
                      setTimeout(() => {
                        setIsWaiterModalOpen(false);
                        setWaiterCalled(false);
                      }, 2000);
                    }}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md transition active:scale-95"
                  >
                    {lang === 'tr' ? 'Çağır' : 'Call Now'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Geri Bildirim Modal */}
        {isFeedbackOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 w-full max-w-sm shadow-2xl text-center space-y-3 animate-in fade-in zoom-in-95 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {lang === 'tr' ? 'Geri Bildirim' : 'Customer Feedback'}
                </h3>
                <button onClick={() => setIsFeedbackOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {feedbackSent ? (
                <div className="py-6 space-y-2">
                  <Sparkles className="w-8 h-8 text-amber-500 mx-auto" />
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {lang === 'tr' ? 'Değerli görüşleriniz için teşekkür ederiz!' : 'Thank you for your valuable feedback!'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center gap-1.5 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 text-amber-400 hover:scale-110 transition"
                      >
                        <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={3}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder={lang === 'tr' ? 'Görüş ve önerilerinizi yazabilirsiniz...' : 'Write your feedback or suggestions...'}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />

                  <button
                    onClick={() => {
                      setFeedbackSent(true);
                      setTimeout(() => {
                        setIsFeedbackOpen(false);
                        setFeedbackSent(false);
                        setFeedbackText('');
                      }, 1800);
                    }}
                    className="w-full py-2.5 bg-slate-900 dark:bg-amber-500 hover:bg-slate-800 dark:hover:bg-amber-600 text-white dark:text-slate-950 text-xs font-bold rounded-xl shadow transition active:scale-95"
                  >
                    {lang === 'tr' ? 'Gönder' : 'Submit'}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
