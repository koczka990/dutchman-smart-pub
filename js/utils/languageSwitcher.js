// This class will be used to switch between languages
class LanguageSwitcher {
  defaultLanguage;
  static language;
  languageList;
  dictionaries;

  constructor() {
    this.languageList = ["en", "sv", "zh"];
    this.defaultLanguage = "en";
    this.dictionaries = {};
    this.setLanguage(this.defaultLanguage);
    this.loadDictionaries();
  }

  // Load dictionary files synchronously
  loadDictionaries() {
    for (const lang of this.languageList) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `data/languages/${lang}.json`, false); // false makes the request synchronous
        xhr.send(null);

        if (xhr.status === 200) {
          this.dictionaries[lang] = JSON.parse(xhr.responseText);
        } else {
          console.error(`Failed to load dictionary for language: ${lang}`);
        }
      } catch (error) {
        console.error(`Failed to load dictionary for language: ${lang}`, error);
      }
    }
  }

  // Set the current language
  // If the language is not supported, it will log an error
  setLanguage(language) {
    if (!this.languageList.includes(language)) {
      console.error("Language not supported:", language);
      return;
    }
    LanguageSwitcher.language = language;
  }

  // Translate a key to the current language
  // If the key is not found in current language, it will translate it to the default language
  // If the key is not found in any language, it will log an error
  translate(key) {
    const lang = LanguageSwitcher.language;
    const defaultLang = this.defaultLanguage;

    if (this.dictionaries[lang] && this.dictionaries[lang][key]) {
      return this.dictionaries[lang][key];
    } else if (this.dictionaries[defaultLang] && this.dictionaries[defaultLang][key]) {
      return this.dictionaries[defaultLang][key];
    } else {
      console.error("Translation key not found:", key);
      return key;
    }
  }
}

export default LanguageSwitcher;