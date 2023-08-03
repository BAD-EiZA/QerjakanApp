const language_level = [
    {
        value: "Beginner"
    },
    {
        value: "Intermediate",
    },
    {
        value: "Advanced",
    }
]

const mappedLanguage = language_level.map((language)=> ({
    value: language.value,
    label: language.value
}))

const useLanguagesLevel = () => {
    const getAllLanguages = () => mappedLanguage;
    return {
        getAllLanguages
    }
};

export default useLanguagesLevel;