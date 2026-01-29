const CACHE_KEY = "seo_translations_cache";

interface TranslationCache {
  [key: string]: string;
}

const getCache = (): TranslationCache => {
  const cache = localStorage.getItem(CACHE_KEY);
  return cache ? JSON.parse(cache) : {};
};

const setCache = (cache: TranslationCache) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
};

/**
 * Translates text from English to Turkish with internal caching.
 * Uses a public Google Translate proxy (mymemory or similar) for ease of use.
 */
export const translateToTurkish = async (text: string): Promise<string> => {
  if (!text) return "";

  const cache = getCache();
  if (cache[text]) {
    return cache[text];
  }

  try {
    // Using MyMemory API (free, no key needed for small volumes)
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=en|tr`
    );
    const data = await response.json();

    if (data.responseData && data.responseData.translatedText) {
      const translatedText = data.responseData.translatedText;
      
      // Update cache
      const updatedCache = { ...getCache(), [text]: translatedText };
      setCache(updatedCache);
      
      return translatedText;
    }
    
    return text; // Fallback to original text
  } catch (error) {
    console.error("Translation failed:", error);
    return text; // Fallback to original text
  }
};

/**
 * Translates a list of results from Yoast SEO
 */
export const translateResults = async (results: any[]): Promise<any[]> => {
  const translatedResults = await Promise.all(
    results.map(async (result) => {
      const translatedText = await translateToTurkish(result.text);
      return { ...result, text: translatedText };
    })
  );
  return translatedResults;
};
