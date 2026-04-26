export const config = {
  anthropicApiKey: 
    import.meta.env.ANTHROPIC_API_KEY || 
    import.meta.env.VITE_ANTHROPIC_API_KEY,
  isDev: import.meta.env.DEV,
  appName: "RankFinal",
  appUrl: "https://rankfinal.com",
};

export function validateConfig() {
  if (!config.anthropicApiKey) {
    console.error(
      "Missing ANTHROPIC_API_KEY environment variable"
    );
    return false;
  }
  return true;
}
