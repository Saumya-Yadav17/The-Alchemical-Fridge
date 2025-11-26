import React, { useState } from 'react';
import { 
  ChefHat, 
  Utensils, 
  Flame, 
  RefreshCw,
  AlertCircle,
  Sparkles,
  Zap,
  Coffee,
  Globe
} from 'lucide-react';
import RecipeDisplay from './components/RecipeDisplay';
import { generateRecipe } from './services/geminiService';
import { Recipe, CookingStyle } from './types';

export default function App() {
  const [ingredients, setIngredients] = useState('');
  const [style, setStyle] = useState<CookingStyle>('hilarious');
  const [includeBackstory, setIncludeBackstory] = useState(true);
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!ingredients.trim()) return;

    setLoading(true);
    setError(null);
    setRecipe(null);

    try {
      const result = await generateRecipe({
        ingredients,
        style,
        includeBackstory
      });
      setRecipe(result);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white text-slate-800 font-sans">
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-orange-600 text-white p-2 rounded-lg">
              <ChefHat size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block font-serif">Alchemical Fridge</span>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-6">
             <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            Wondering what to make after office hours?
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 font-serif leading-tight">
            Turn leftovers into <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">legendary meals.</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Dump your fridge contents below, pick a persona, and let the AI invent a disaster or a masterpiece.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Section */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Ingredients Input */}
            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-orange-500/5 border border-orange-100">
              <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                <Utensils size={18} className="text-orange-500" />
                What's in your fridge?
              </label>
              <textarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="2 eggs, half a lemon, soy sauce, stale crackers, mystery cheese..."
                className="w-full h-40 p-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 outline-none resize-none text-slate-700 placeholder:text-slate-400 transition-all"
              />
            </div>

            {/* Style Selection Cards */}
            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-orange-500/5 border border-orange-100">
              <label className="block text-sm font-bold text-slate-700 mb-4">Select Chef Persona</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'hilarious', label: 'Chaos Mode', icon: Zap, desc: 'Unhinged & Funny' },
                  { id: 'gourmet', label: 'Fine Dining', icon: Sparkles, desc: 'Pretentious' },
                  { id: 'indian', label: 'Desi Twist', icon: Globe, desc: 'Spicy & Rich' },
                  { id: 'easy', label: 'Lazy Cook', icon: Coffee, desc: 'Minimal Effort' }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id as CookingStyle)}
                    className={`p-3 rounded-xl border-2 text-left transition-all duration-200 flex flex-col gap-2 ${
                      style === s.id 
                        ? 'border-orange-500 bg-orange-50/50 ring-1 ring-orange-500' 
                        : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <s.icon size={20} className={style === s.id ? 'text-orange-600' : 'text-slate-400'} />
                    <div>
                      <div className={`font-bold text-sm ${style === s.id ? 'text-orange-900' : 'text-slate-700'}`}>{s.label}</div>
                      <div className="text-xs text-slate-500">{s.desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Backstory Toggle */}
              <div className="mt-6 flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer" onClick={() => setIncludeBackstory(!includeBackstory)}>
                 <span className="text-sm font-medium text-slate-700">Generate absurd backstory?</span>
                 <div className={`w-12 h-7 rounded-full relative transition-colors duration-200 ${includeBackstory ? 'bg-orange-500' : 'bg-slate-300'}`}>
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${includeBackstory ? 'left-6' : 'left-1'}`} />
                 </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleGenerate}
              disabled={loading || !ingredients.trim()}
              className="w-full py-5 rounded-2xl font-bold text-lg shadow-xl shadow-orange-500/20 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" /> Cooking Magic...
                </>
              ) : (
                <>
                  <Flame className="fill-white" /> Invent Recipe
                </>
              )}
            </button>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-start gap-3 animate-fade-in">
                <AlertCircle className="shrink-0 mt-0.5" size={20} />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
          </div>

          {/* Output Section */}
          <div className="lg:col-span-7">
            {!recipe && !loading && (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                   <Utensils size={40} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-400 mb-2">The Kitchen is Empty</h3>
                <p className="text-slate-400 max-w-xs mx-auto">Enter ingredients on the left and hit the button to start the AI chef.</p>
              </div>
            )}

            {loading && (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-xl shadow-orange-500/5 border border-orange-100">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin mb-8"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <ChefHat size={32} className="text-orange-500/50" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Consulting the Culinary Gods</h3>
                <p className="text-slate-500 animate-pulse">Analyzing flavor profiles...</p>
              </div>
            )}

            {recipe && !loading && (
              <RecipeDisplay recipe={recipe} style={style} />
            )}
          </div>
        </div>
      </main>
      
      <footer className="py-12 text-center text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} The Alchemical Fridge.</p>
      </footer>
    </div>
  );
}