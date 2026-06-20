// ======================================
// LINGOQUEST PRO
// API.JS
// ======================================

const API = {

    // ==========================
    // PALABRAS B1
    // ==========================

    vocabulary: [

        {
            word: "achievement",
            translation: "logro"
        },

        {
            word: "environment",
            translation: "medio ambiente"
        },

        {
            word: "opportunity",
            translation: "oportunidad"
        },

        {
            word: "research",
            translation: "investigación"
        },

        {
            word: "development",
            translation: "desarrollo"
        },

        {
            word: "technology",
            translation: "tecnología"
        },

        {
            word: "responsibility",
            translation: "responsabilidad"
        },

        {
            word: "knowledge",
            translation: "conocimiento"
        },

        {
            word: "improve",
            translation: "mejorar"
        },

        {
            word: "successful",
            translation: "exitoso"
        }

    ],

    // ==========================
    // API REAL
    // ==========================

    async getDefinition(word){

        const response = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        );

        if(!response.ok){

            throw new Error(
                "No se pudo obtener la definición."
            );

        }

        const data =
        await response.json();

        return data[0];

    },

    // ==========================
    // PREGUNTA TRADUCCIÓN
    // ==========================

    createTranslationQuestion(){

        const correct =

        this.vocabulary[
            Math.floor(
                Math.random() *
                this.vocabulary.length
            )
        ];

        const options = [

            correct.translation,

            ...this.vocabulary

            .filter(
                item =>
                item.word !== correct.word
            )

            .sort(
                () => Math.random() - 0.5
            )

            .slice(0,3)

            .map(
                item =>
                item.translation
            )

        ]

        .sort(
            () => Math.random() - 0.5
        );

        return {

            question:
            `¿Cómo se traduce "${correct.word}"?`,

            correct:
            correct.translation,

            options

        };

    },

    // ==========================
    // PREGUNTA SIGNIFICADO
    // ==========================

    createMeaningQuestion(){

        const correct =

        this.vocabulary[
            Math.floor(
                Math.random() *
                this.vocabulary.length
            )
        ];

        const options = [

            correct.word,

            ...this.vocabulary

            .filter(
                item =>
                item.word !== correct.word
            )

            .sort(
                () => Math.random() - 0.5
            )

            .slice(0,3)

            .map(
                item =>
                item.word
            )

        ]

        .sort(
            () => Math.random() - 0.5
        );

        return {

            question:
            `¿Qué palabra significa "${correct.translation}"?`,

            correct:
            correct.word,

            options

        };

    },

    // ==========================
    // PREGUNTA DEFINICIÓN
    // ==========================

    async createDefinitionQuestion(){

        const selected =

        this.vocabulary[
            Math.floor(
                Math.random() *
                this.vocabulary.length
            )
        ];

        const data =
        await this.getDefinition(
            selected.word
        );

        const definition =

            data.meanings?.[0]
            ?.definitions?.[0]
            ?.definition

            ||

            "Definition unavailable";

        const options = [

            selected.word,

            ...this.vocabulary

            .filter(
                item =>
                item.word !== selected.word
            )

            .sort(
                () => Math.random() - 0.5
            )

            .slice(0,3)

            .map(
                item =>
                item.word
            )

        ]

        .sort(
            () => Math.random() - 0.5
        );

        return {

            question:
            `¿Qué palabra coincide con esta definición?\n\n"${definition}"`,

            correct:
            selected.word,

            options

        };

    },

    // ==========================
    // PREGUNTA ORACIÓN
    // ==========================

    createSentenceQuestion(){

        const questions = [

            {
                question:
                "Technology is developing very ____.",

                correct:
                "quickly",

                options:[
                    "quickly",
                    "angry",
                    "small",
                    "dangerous"
                ]
            },

            {
                question:
                "Research helps us find new ____.",

                correct:
                "solutions",

                options:[
                    "solutions",
                    "mistakes",
                    "arguments",
                    "problems"
                ]
            },

            {
                question:
                "Education can improve your ____.",

                correct:
                "future",

                options:[
                    "future",
                    "window",
                    "garden",
                    "phone"
                ]
            }

        ];

        return questions[
            Math.floor(
                Math.random() *
                questions.length
            )
        ];

    },

    // ==========================
    // GENERAR LECCIÓN
    // ==========================

    async createExercises(){

        const exercises = [

            this.createTranslationQuestion(),

            this.createMeaningQuestion(),

            this.createSentenceQuestion(),

            await this.createDefinitionQuestion()

        ];

        return exercises.sort(
            () => Math.random() - 0.5
        );

    }

};