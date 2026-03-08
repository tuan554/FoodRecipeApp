"use client";

import { useMemo, useState } from "react";
import type { IngredientOption } from "@/lib/ingredientKeywords";
import { searchIngredientOptions } from "@/lib/ingredientKeywords";

type MealDbIngredient = {
  name: string;
  original?: string;
};

type MealDbRecipe = {
  id: number;
  title: string;
  image?: string;
  usedIngredientCount?: number;
  missedIngredientCount?: number;
  usedIngredients?: MealDbIngredient[];
  missedIngredients?: MealDbIngredient[];
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<IngredientOption[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [recipes, setRecipes] = useState<MealDbRecipe[]>([]);
  const [pinned, setPinned] = useState<MealDbRecipe[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const suggestions = useMemo(
    () => searchIngredientOptions(query, selected.map((item) => item.id)),
    [query, selected],
  );

  const handleSelect = (option: IngredientOption) => {
    setSelected((current) =>
      current.some((item) => item.id === option.id) ? current : [...current, option],
    );
    setQuery("");
  };

  const handleRemove = (id: string) => {
    setSelected((current) => current.filter((item) => item.id !== id));
  };

  const handleTogglePin = (recipe: MealDbRecipe) => {
    setPinned((current) => {
      const exists = current.some((item) => item.id === recipe.id);
      if (exists) {
        return current.filter((item) => item.id !== recipe.id);
      }
      return [...current, recipe];
    });
  };

  const handleSearchRecipes = async () => {
    if (selected.length === 0) {
      setError("Select at least one ingredient before searching.");
      return;
    }

    setError(null);
    setLoadingRecipes(true);

    // Use the first selected ingredient as the primary filter for TheMealDB
    const primary = selected[0];
    const primaryName = primary.label.toLowerCase();

    const baseUrl = "https://www.themealdb.com/api/json/v1/1";

    try {
      // 1) Find meals that use the primary ingredient
      const filterUrl = `${baseUrl}/filter.php?i=${encodeURIComponent(primaryName)}`;
      const filterRes = await fetch(filterUrl);

      if (!filterRes.ok) {
        throw new Error(`Filter request failed with status ${filterRes.status}`);
      }

      type MealSummary = { idMeal: string; strMeal: string; strMealThumb: string };
      type FilterResponse = { meals: MealSummary[] | null };

      const filterData: FilterResponse = await filterRes.json();
      const summaries = filterData.meals ?? [];

      if (summaries.length === 0) {
        setRecipes([]);
        setError("No matched recipe.");
      } else {
        // Limit the number of detailed lookups to keep things fast
        const limited = summaries.slice(0, 6);

        type MealDetail = {
          idMeal: string;
          strMeal: string;
          strMealThumb: string;
          [key: string]: unknown;
        };

        const detailedRecipes = await Promise.all(
          limited.map(async (meal) => {
            const lookupUrl = `${baseUrl}/lookup.php?i=${meal.idMeal}`;
            const lookupRes = await fetch(lookupUrl);
            if (!lookupRes.ok) return null;

            type LookupResponse = { meals: MealDetail[] | null };
            const lookupData: LookupResponse = await lookupRes.json();
            const full = lookupData.meals?.[0];
            if (!full) return null;

            const ingredients: MealDbIngredient[] = [];

            for (let i = 1; i <= 20; i += 1) {
              const name = (full[`strIngredient${i}`] as string | undefined)?.trim();
              const measure = (full[`strMeasure${i}`] as string | undefined)?.trim();

              if (name) {
                ingredients.push({
                  name,
                  original: measure && measure.length > 0 ? `${measure} ${name}` : name,
                });
              }
            }

            // Build a list of all keywords for selected ingredients (label + synonyms)
            const selectedKeywordSets = selected.map((option) => {
              const allKeywords = [option.label, ...option.keywords].map((kw) =>
                kw.toLowerCase(),
              );
              return allKeywords;
            });

            const used: MealDbIngredient[] = [];
            const missed: MealDbIngredient[] = [];

            ingredients.forEach((ingredient) => {
              const ingLower = ingredient.name.toLowerCase();
              const matchesSelected = selectedKeywordSets.some((keywords) =>
                keywords.some(
                  (kw) => ingLower.includes(kw) || kw.includes(ingLower),
                ),
              );

              if (matchesSelected) {
                used.push(ingredient);
              } else {
                missed.push(ingredient);
              }
            });

            return {
              id: Number(meal.idMeal),
              title: meal.strMeal,
              image: meal.strMealThumb,
              usedIngredients: used,
              missedIngredients: missed,
              usedIngredientCount: used.length,
              missedIngredientCount: missed.length,
            } satisfies MealDbRecipe;
          }),
        );

        const cleaned = detailedRecipes.filter(
          (recipe): recipe is MealDbRecipe => recipe !== null,
        );

        if (cleaned.length === 0) {
          setRecipes([]);
          setError("No matched recipe.");
        } else {
          setRecipes(cleaned);
          setError(null);
        }
      }
    } catch (err) {
      // On any fetch failure, still show a friendly "no matched recipe" message
      setError("No matched recipe.");
      setRecipes([]);
    } finally {
      setLoadingRecipes(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 px-4 py-10 font-sans text-zinc-900 dark:bg-slate-950 dark:text-zinc-50">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-orange-600 sm:text-4xl dark:text-orange-300">
            Search ingredients
          </h1>
          <p className="max-w-2xl text-sm text-zinc-600 dark:text-zinc-300">
            Start typing an ingredient (for example: <span className="font-medium">chicken</span>,{" "}
            <span className="font-medium">tomato</span>, <span className="font-medium">rice</span>
            ) and choose from the suggestions. Each choice becomes a tag you can use later when
            fetching recipes.
          </p>
        </header>

        <section className="rounded-2xl border border-orange-100 bg-white p-6 shadow-[0_18px_40px_rgba(249,115,22,0.10)] dark:border-orange-700/60 dark:bg-slate-950/70">
          <div className="flex flex-col gap-4">
            <label className="text-sm font-semibold text-orange-900 dark:text-orange-200">
              Ingredients
            </label>
            <div className="relative">
              <div
                className="flex min-h-[48px] items-center gap-2 rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm shadow-sm transition focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-200 dark:border-orange-700 dark:bg-slate-900 dark:text-zinc-50 dark:focus-within:border-orange-400 dark:focus-within:ring-orange-700/60"
                onClick={() => {
                  const input = document.getElementById("ingredient-search-input");
                  if (input instanceof HTMLInputElement) {
                    input.focus();
                  }
                }}
              >
                <input
                  id="ingredient-search-input"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => {
                    // Delay closing so a click on a suggestion still registers
                    setTimeout(() => setIsFocused(false), 120);
                  }}
                  placeholder="Search ingredients..."
                  className="w-full border-none bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-50 dark:placeholder:text-zinc-500"
                />
              </div>

              {isFocused && query.trim().length > 0 && suggestions.length > 0 && (
                <ul className="absolute z-10 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-orange-200 bg-white text-sm shadow-lg dark:border-orange-700 dark:bg-slate-900">
                  {suggestions.map((option) => (
                    <li key={option.id}>
                      <button
                        type="button"
                        className="flex w-full items-start gap-2 px-3 py-2 text-left text-sm text-zinc-800 hover:bg-zinc-100 dark:text-zinc-50 dark:hover:bg-zinc-800/70"
                        onMouseDown={(event) => {
                          // Prevent input blur before we handle the click
                          event.preventDefault();
                        }}
                        onClick={() => handleSelect(option)}
                      >
                        <span className="font-medium">{option.label}</span>
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          {option.keywords.slice(0, 3).join(", ")}
                          {option.keywords.length > 3 ? "…" : ""}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {selected.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selected.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    className="inline-flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-orange-600 dark:bg-orange-400 dark:text-orange-950 dark:hover:bg-orange-300"
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px]">×</span>
                  </button>
                ))}
              </div>
            )}

            <div className="mt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleSearchRecipes}
                disabled={selected.length === 0 || loadingRecipes}
                className="inline-flex items-center justify-center rounded-full bg-orange-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-zinc-400 dark:bg-orange-400 dark:text-orange-950 dark:hover:bg-orange-300"
              >
                {loadingRecipes ? "Searching recipes..." : "Find recipes"}
              </button>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Uses your selected ingredients to fetch recipes.
              </span>
            </div>
          </div>
        </section>

        {pinned.length > 0 && (
          <section className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-sm text-zinc-900 shadow-sm dark:border-amber-500/60 dark:bg-amber-950/50 dark:text-amber-50">
            <h2 className="mb-3 text-base font-semibold">Pinned recipes</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pinned.map((recipe) => (
                <article
                  key={recipe.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm dark:border-amber-500/60 dark:bg-slate-950"
                >
                  {recipe.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="h-40 w-full object-cover"
                    />
                  )}
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
                        {recipe.title}
                      </h3>
                      <button
                        type="button"
                        onClick={() => handleTogglePin(recipe)}
                        className="shrink-0 rounded-full border border-amber-400 bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800 hover:bg-amber-200 dark:border-amber-400/80 dark:bg-amber-900/70 dark:text-amber-50"
                      >
                        Unpin
                      </button>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Used ingredients: {recipe.usedIngredientCount ?? 0} • Missing:{" "}
                      {recipe.missedIngredientCount ?? 0}
                    </p>
                    {recipe.missedIngredients && recipe.missedIngredients.length > 0 && (
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        Missing ingredients:{" "}
                        {recipe.missedIngredients.map((ing) => ing.name).join(", ")}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-orange-100 bg-white p-6 text-sm text-zinc-800 shadow-sm dark:border-orange-700/70 dark:bg-slate-950/70 dark:text-zinc-100">
          <h2 className="mb-3 text-base font-semibold">Recipes</h2>

          {error && (
            <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </p>
          )}

          {!error && recipes.length === 0 && !loadingRecipes && (
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              No recipes yet. Select some ingredients and click{" "}
              <span className="font-medium">Find recipes</span> to see suggestions.
            </p>
          )}

          {recipes.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recipes.map((recipe) => (
                <article
                  key={recipe.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:border-orange-300 dark:border-orange-700 dark:bg-slate-950"
                >
                  {recipe.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="h-40 w-full object-cover"
                    />
                  )}
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
                        {recipe.title}
                      </h3>
                      <button
                        type="button"
                        onClick={() => handleTogglePin(recipe)}
                        className="shrink-0 rounded-full border border-zinc-300 bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-700 hover:bg-zinc-200 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                      >
                        {pinned.some((p) => p.id === recipe.id) ? "Pinned" : "Pin"}
                      </button>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Used ingredients: {recipe.usedIngredientCount ?? 0} • Missing:{" "}
                      {recipe.missedIngredientCount ?? 0}
                    </p>
                    {recipe.missedIngredients && recipe.missedIngredients.length > 0 && (
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        Missing ingredients:{" "}
                        {recipe.missedIngredients.map((ing) => ing.name).join(", ")}
                      </p>
                    )}
                    <a
                      href={`https://spoonacular.com/recipes/${encodeURIComponent(
                        recipe.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                      )}-${recipe.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-auto inline-flex text-xs font-medium text-zinc-900 underline-offset-2 hover:underline dark:text-zinc-100"
                    >
                      View full recipe
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
