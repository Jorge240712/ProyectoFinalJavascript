// ======================================
// LINGOQUEST PRO
// STORAGE.JS
// ======================================

const Storage = {

    PLAYER_KEY: "lingoquest_player",
    THEME_KEY: "lingoquest_theme",

    // ==========================
    // CREAR JUGADOR
    // ==========================

    createPlayer(name, language){

        const player = {

            name,
            language,

            levelName: "A1",

            xp: 0,
            level: 1,

            coins: 0,
            hearts: 5,

            streak: 0,

            completedLessons: 0,

            correctAnswers: 0,
            totalAnswers: 0,

            studyTime: 0,

            placementCompleted: false,

            createdAt: Date.now()

        };

        this.savePlayer(player);

        return player;

    },

    // ==========================
    // GUARDAR
    // ==========================

    savePlayer(player){

        localStorage.setItem(
            this.PLAYER_KEY,
            JSON.stringify(player)
        );

    },

    // ==========================
    // CARGAR
    // ==========================

    loadPlayer(){

        const data =
        localStorage.getItem(
            this.PLAYER_KEY
        );

        return data
            ? JSON.parse(data)
            : null;

    },

    // ==========================
    // XP
    // ==========================

    addXP(amount){

        const player =
        this.loadPlayer();

        if(!player) return;

        player.xp += amount;

        player.level =
        Math.floor(
            player.xp / 100
        ) + 1;

        this.savePlayer(player);

        return player;

    },

    // ==========================
    // MONEDAS
    // ==========================

    addCoins(amount){

        const player =
        this.loadPlayer();

        if(!player) return;

        player.coins += amount;

        this.savePlayer(player);

        return player;

    },

    // ==========================
    // CORAZONES
    // ==========================

    loseHeart(){

        const player =
        this.loadPlayer();

        if(!player) return;

        player.hearts = Math.max(
            0,
            player.hearts - 1
        );

        this.savePlayer(player);

        return player;

    },

    restoreHearts(){

        const player =
        this.loadPlayer();

        if(!player) return;

        player.hearts = 5;

        this.savePlayer(player);

        return player;

    },

    // ==========================
    // RACHA
    // ==========================

    addStreak(){

        const player =
        this.loadPlayer();

        if(!player) return;

        player.streak++;

        this.savePlayer(player);

        return player;

    },

    resetStreak(){

        const player =
        this.loadPlayer();

        if(!player) return;

        player.streak = 0;

        this.savePlayer(player);

        return player;

    },

    // ==========================
    // LECCIONES
    // ==========================

    completeLesson(){

        const player =
        this.loadPlayer();

        if(!player) return;

        player.completedLessons++;

        this.savePlayer(player);

        return player;

    },

    // ==========================
    // RESPUESTAS
    // ==========================

    addCorrectAnswer(){

        const player =
        this.loadPlayer();

        if(!player) return;

        player.correctAnswers++;
        player.totalAnswers++;

        this.savePlayer(player);

        return player;

    },

    addWrongAnswer(){

        const player =
        this.loadPlayer();

        if(!player) return;

        player.totalAnswers++;

        this.savePlayer(player);

        return player;

    },

    // ==========================
    // PRECISIÓN
    // ==========================

    getAccuracy(){

        const player =
        this.loadPlayer();

        if(
            !player ||
            player.totalAnswers === 0
        ){
            return 0;
        }

        return Math.round(
            (
                player.correctAnswers /
                player.totalAnswers
            ) * 100
        );

    },

    // ==========================
    // TIEMPO DE ESTUDIO
    // ==========================

    addStudyTime(minutes){

        const player =
        this.loadPlayer();

        if(!player) return;

        player.studyTime += minutes;

        this.savePlayer(player);

        return player;

    },

    // ==========================
    // NIVEL DE INGLÉS
    // ==========================

    setEnglishLevel(level){

        const player =
        this.loadPlayer();

        if(!player) return;

        player.levelName = level;
        player.placementCompleted = true;

        this.savePlayer(player);

        return player;

    },

    // ==========================
    // LOGROS
    // ==========================

    getAchievements(){

        const player =
        this.loadPlayer();

        if(!player) return [];

        const achievements = [];

        if(player.streak >= 1){

            achievements.push(
                "🔥 Primera Racha"
            );

        }

        if(player.xp >= 100){

            achievements.push(
                "⭐ 100 XP"
            );

        }

        if(player.correctAnswers >= 10){

            achievements.push(
                "🧠 10 Respuestas"
            );

        }

        if(player.level >= 5){

            achievements.push(
                "🏆 Nivel 5"
            );

        }

        if(player.level >= 10){

            achievements.push(
                "👑 Nivel 10"
            );

        }

        if(player.completedLessons >= 20){

            achievements.push(
                "🌍 Políglota"
            );

        }

        return achievements;

    },

    // ==========================
    // TEMA
    // ==========================

    saveTheme(theme){

        localStorage.setItem(
            this.THEME_KEY,
            theme
        );

    },

    loadTheme(){

        return (
            localStorage.getItem(
                this.THEME_KEY
            ) || "light"
        );

    },

    // ==========================
    // BORRAR TODO
    // ==========================

    resetAll(){

        localStorage.removeItem(
            this.PLAYER_KEY
        );

        localStorage.removeItem(
            this.THEME_KEY
        );

    }

};