class Language {
    static getAvailableLanguages() {
        return ["en", "sv", "zh"]; // English, Swedish, Chinese
    }

    static setLanguage(lang) {
        if (!this.getAvailableLanguages().includes(lang)) return;
        localStorage.setItem("language", lang);
    }

    static getLanguage() {
        return localStorage.getItem("language") || "en";
    }

    static translate(key) {
        const langData = Database.load(`lang-${this.getLanguage()}`) || {};
        return langData[key] || key; // Fallback to key if translation is missing
    }

    static loadTranslations(lang, translations) {
        Database.save(`lang-${lang}`, translations);
    }
}
