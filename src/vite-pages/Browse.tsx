import { useMemo, useState } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, ScoreBar } from "@/components/rankfinal/ui";
import { PageWrapper } from "@/components/rankfinal/layout";
import { categories, countries, getFrequencyLabel } from "@/data/categories";
import { cn } from "@/lib/utils";

const resultNames = ["Best overall", "Best value", "Most transparent", "Fastest updated", "Highest confidence", "Best for families"];

export default function Browse() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category");
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategory ?? categories[0].id);
  const [country, setCountry] = useState("Norway");
  const [countryQuery, setCountryQuery] = useState("");
  const [budget, setBudget] = useState(60);
  const [recentOnly, setRecentOnly] = useState(true);
  const [mobileTreeOpen, setMobileTreeOpen] = useState(false);

  const selectedCategory = categories.find((category) => category.id === selectedCategoryId) ?? categories[0];
  const filteredCountries = countries.filter((item) => item.toLowerCase().includes(countryQuery.toLowerCase()));
  const results = useMemo(
    () => selectedCategory.subcategories.slice(0, 6).map((subcategory, index) => ({
      title: subcategory,
      label: resultNames[index % resultNames.length],
      score: 9.3 - index * 0.3,
      sources: Math.max(18, Math.round(selectedCategory.sourceCount / (index + 8))),
    })),
    [selectedCategory],
  );

  const CategoryTree = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn("space-y-2", mobile && !mobileTreeOpen && "hidden")}>
      {categories.map((category) => {
        const active = category.id === selectedCategory.id;
        return (
          <div key={category.id} className={cn("rounded-input border transition-colors", active ? "border-accent-amber/60 bg-accent-amber/10" : "border-border bg-background") }>
            <button
              type="button"
              onClick={() => {
                setSelectedCategoryId(category.id);
                setMobileTreeOpen(false);
              }}
              className="flex w-full items-center gap-3 px-3 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="text-xl" aria-hidden="true">{category.icon}</span>
              <span className="min-w-0 flex-1">
                <span className={cn("block text-sm font-bold", active ? "text-accent-amber" : "text-text-primary")}>{category.name}</span>
                <span className="block text-xs text-text-secondary">{category.subcategories.length} subcategories</span>
              </span>
              <ChevronDown className={cn("size-4 text-text-secondary transition-transform", active && "rotate-180 text-accent-amber")} aria-hidden="true" />
            </button>
            {active && (
              <div className="space-y-1 border-t border-border px-3 py-3">
                {category.subcategories.map((subcategory) => (
                  <button key={subcategory} type="button" className="block w-full rounded-input px-2 py-1.5 text-left text-xs font-medium text-text-secondary transition-colors hover:bg-secondary hover:text-text-primary">
                    {subcategory}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <PageWrapper className="py-8 lg:py-10">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardHeader className="pb-4">
              <button
                type="button"
                onClick={() => setMobileTreeOpen((open) => !open)}
                className="flex w-full items-center justify-between text-left lg:pointer-events-none"
              >
                <div>
                  <CardTitle>Category tree</CardTitle>
                  <CardDescription>Browse all ranking markets</CardDescription>
                </div>
                <ChevronDown className={cn("size-5 text-text-secondary transition-transform lg:hidden", mobileTreeOpen && "rotate-180")} />
              </button>
            </CardHeader>
            <CardContent>
              <div className="lg:hidden"><CategoryTree mobile /></div>
              <div className="hidden lg:block"><CategoryTree /></div>
            </CardContent>
          </Card>
        </aside>

        <div className="space-y-6">
          <Card>
            <CardContent className="grid gap-4 p-4 md:grid-cols-[1.2fr_1fr_auto] md:items-end">
              <label className="space-y-2">
                <span className="flex items-center gap-2 text-sm font-bold text-text-primary"><Search className="size-4 text-accent-amber" /> Country</span>
                <div className="rounded-input border border-border bg-background p-2">
                  <input
                    value={countryQuery}
                    onChange={(event) => setCountryQuery(event.target.value)}
                    placeholder={country}
                    className="mb-2 h-9 w-full rounded-input border border-border bg-surface px-3 text-sm text-text-primary outline-none placeholder:text-text-secondary focus:border-accent-amber"
                  />
                  <select value={country} onChange={(event) => setCountry(event.target.value)} className="h-10 w-full rounded-input border border-border bg-surface px-3 text-sm font-semibold text-text-primary outline-none focus:border-accent-amber">
                    {filteredCountries.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>
              </label>

              <label className="space-y-3">
                <span className="text-sm font-bold text-text-primary">Budget range: {budget}%</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={budget}
                  onChange={(event) => setBudget(Number(event.target.value))}
                  className="w-full accent-accent-amber"
                />
              </label>

              <label className="flex items-center gap-3 rounded-input border border-border bg-background px-4 py-3 text-sm font-bold text-text-primary">
                <input type="checkbox" checked={recentOnly} onChange={(event) => setRecentOnly(event.target.checked)} className="size-4 accent-accent-amber" />
                Recently updated only
              </label>
            </CardContent>
          </Card>

          <section className="space-y-5">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-3">
                    <Badge variant={selectedCategory.frequency === "daily" ? "green" : selectedCategory.frequency === "weekly" ? "amber" : "gray"}>{getFrequencyLabel(selectedCategory.frequency)}</Badge>
                    <div>
                      <h1 className="text-3xl font-extrabold text-text-primary sm:text-4xl"><span aria-hidden="true">{selectedCategory.icon}</span> {selectedCategory.name}</h1>
                      <CardDescription className="mt-3 max-w-3xl">{selectedCategory.description}</CardDescription>
                    </div>
                  </div>
                  <div className="rounded-card border border-border bg-background px-4 py-3 text-right">
                    <div className="text-2xl font-extrabold text-text-primary">{selectedCategory.sourceCount.toLocaleString()}</div>
                    <div className="text-xs font-semibold text-text-secondary">verified sources</div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {results.map((result) => (
                <Card key={result.title} className="hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Badge variant="purple">{result.label}</Badge>
                        <CardTitle className="mt-3 text-lg">{result.title}</CardTitle>
                      </div>
                      <span className="rounded-pill border border-border bg-background px-3 py-1 text-xs font-bold text-text-secondary">{country}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ScoreBar score={result.score} label="Confidence" />
                    <div className="flex items-center justify-between text-xs font-semibold text-text-secondary">
                      <span>{result.sources} sources</span>
                      <span>{recentOnly ? "Recently updated" : "All updates"}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </PageWrapper>
  );
}
