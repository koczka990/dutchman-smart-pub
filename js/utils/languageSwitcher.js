/* how to use:
    1. Create a new instance of LanguageSwitcher
    2. Use the setLanguage method to set the current language
    3. Use the translateHTML method to translate all HTML elements
    4. To make an HTML element translatable, add a data-translate-key attribute with the key to translate
 */

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

  // Translate all HTML elements with the data-translate-key attribute
  translateHTML() {
    let translates = $("[data-translate-key]");
    translates.each((index, element) => {
      let key = $(element).data("translate-key");
      $(element).html(this.translate(key));
    });
  }

  getAllTranslatables() {
    return $("[data-translate-key]");
  }

  getLanguageList() {
    return this.languageList;
  }

  getCurrentLanguage() {
    return LanguageSwitcher.language;
  }
}

export default LanguageSwitcher;