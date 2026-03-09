const SAVE_KEY = 'last_shelter_v7_colony_save';

const timeSlots = ['Matin', 'Après-midi', 'Soir', 'Nuit'];

const colonRoles = ['exploration', 'defense', 'medicine', 'construction', 'production', 'rest'];

const weatherDefs = [
    { id: 'clear', label: '☀️ Temps clair' },
    { id: 'rain', label: '🌧️ Pluie froide' },
    { id: 'fog', label: '🌫️ Brouillard' },
    { id: 'cold', label: '❄️ Froid sec' }
];

const icons = {
    food: '🍖',
    water: '💧',
    bandage: '🩹',
    medicine: '💊',
    ammo: '🔫',
    materials: '🔩',
    fuel: '⛽'
};

const colonyFoundingCost = { materials: 12, food: 8, water: 8, ammo: 2, fuel: 1 };

const colonyUpgradeDefs = [
    {
        id: 'walls',
        name: 'Murs renforcés',
        role: 'defense',
        desc: 'Palissades, tôles et renforts lourds pour encaisser les assauts.',
        levels: [
            { cost: { materials: 6, ammo: 1 }, bonus: '+8 défense' },
            { cost: { materials: 10, ammo: 2 }, bonus: '+12 défense' },
            { cost: { materials: 14, ammo: 2, fuel: 1 }, bonus: '+16 défense' }
        ]
    },
    {
        id: 'dormitory',
        name: 'Dortoir étendu',
        role: 'support',
        desc: 'Plus de lits, plus de place et une meilleure récupération.',
        levels: [
            { cost: { materials: 5, water: 2 }, bonus: '+2 capacité' },
            { cost: { materials: 8, food: 2, water: 2 }, bonus: '+2 capacité' },
            { cost: { materials: 12, food: 3, water: 3 }, bonus: '+2 capacité' }
        ]
    },
    {
        id: 'clinic',
        name: 'Infirmerie',
        role: 'medicine',
        desc: 'Soins plus efficaces, récupération plus rapide et moins de pertes.',
        levels: [
            { cost: { materials: 5, bandage: 1, medicine: 1 }, bonus: '+4 soins' },
            { cost: { materials: 8, bandage: 2, medicine: 1 }, bonus: '+6 soins' },
            { cost: { materials: 12, bandage: 2, medicine: 2 }, bonus: '+8 soins' }
        ]
    },
    {
        id: 'workshop',
        name: 'Atelier',
        role: 'construction',
        desc: 'Optimise les réparations et améliore le rendement des récupérations.',
        levels: [
            { cost: { materials: 6, fuel: 1 }, bonus: '+2 production' },
            { cost: { materials: 10, fuel: 1, ammo: 1 }, bonus: '+3 production' },
            { cost: { materials: 14, fuel: 2, ammo: 1 }, bonus: '+4 production' }
        ]
    },
    {
        id: 'garden',
        name: 'Potager colonie',
        role: 'production',
        desc: 'Une vraie culture pour soulager la pression sur les rations.',
        levels: [
            { cost: { materials: 4, water: 2 }, bonus: '+2 nourriture/jour' },
            { cost: { materials: 7, water: 3 }, bonus: '+4 nourriture/jour' },
            { cost: { materials: 10, water: 4 }, bonus: '+6 nourriture/jour' }
        ]
    },
    {
        id: 'waterStation',
        name: 'Station de récupération d’eau',
        role: 'production',
        desc: 'Filtres, bâches et stockage pour assurer une vraie réserve d’eau.',
        levels: [
            { cost: { materials: 5, bandage: 1 }, bonus: '+2 eau/jour' },
            { cost: { materials: 8, fuel: 1 }, bonus: '+4 eau/jour' },
            { cost: { materials: 12, fuel: 1, bandage: 1 }, bonus: '+6 eau/jour' }
        ]
    },
    {
        id: 'tower',
        name: 'Tour de garde',
        role: 'defense',
        desc: 'Observation et contrôle du périmètre sur une plus grande distance.',
        levels: [
            { cost: { materials: 5, ammo: 1 }, bonus: '+4 défense' },
            { cost: { materials: 8, ammo: 2 }, bonus: '+6 défense' },
            { cost: { materials: 12, ammo: 2, fuel: 1 }, bonus: '+8 défense' }
        ]
    }
];

const colonyRecruitPool = [
    { name: 'Hugo Mercier', age: 32, rarity: 'rare', trait: 'Débrouillard', role: 'exploration', skills: { exploration: 8, defense: 4, medicine: 1, construction: 5, production: 6 } },
    { name: 'Lina Kader', age: 28, rarity: 'common', trait: 'Courageuse', role: 'defense', skills: { exploration: 3, defense: 9, medicine: 2, construction: 4, production: 3 } },
    { name: 'LePetit Mij', age: 34, rarity: 'elite', trait: 'Débrouillard', role: 'production', skills: { exploration: 5, defense: 4, medicine: 3, construction: 5, production: 10 } },
    { name: 'Kevun Pinto', age: 27, rarity: 'elite', trait: 'Serieux', role: 'exploration', skills: { exploration: 10, defense: 6, medicine: 3, construction: 5, production: 6 } },
    { name: 'Milo Vasseur', age: 41, rarity: 'common', trait: 'Bricoleur', role: 'construction', skills: { exploration: 4, defense: 5, medicine: 2, construction: 8, production: 6 } },
    { name: 'Naël Soria', age: 36, rarity: 'rare', trait: 'Ancien infirmier', role: 'medicine', skills: { exploration: 3, defense: 4, medicine: 8, construction: 3, production: 4 } },
    { name: 'Inès Volta', age: 27, rarity: 'elite', trait: 'Éclaireuse', role: 'exploration', skills: { exploration: 9, defense: 5, medicine: 2, construction: 3, production: 5 } },
    { name: 'Ptit Mika', age: 31, rarity: 'elite', trait: 'Ancien geek pro', role: 'defense', skills: { exploration: 10, defense: 4, medicine: 3, construction: 5, production: 5 } },
    { name: 'Yanis Corbin', age: 39, rarity: 'common', trait: 'Endurant', role: 'production', skills: { exploration: 5, defense: 5, medicine: 2, construction: 5, production: 8 } },
    { name: 'Sacha Brume', age: 34, rarity: 'rare', trait: 'Ancien militaire', role: 'defense', skills: { exploration: 5, defense: 9, medicine: 1, construction: 4, production: 3 } },
    { name: 'Eva Morel', age: 30, rarity: 'common', trait: 'Calme', role: 'rest', skills: { exploration: 4, defense: 4, medicine: 5, construction: 5, production: 5 } }
];

const simpleLocations = [
    {
        id: 'house',
        name: 'Maison abandonnée',
        risk: 28,
        loot: 'nourriture',
        desc: 'Placards vides mais parfois encore utiles.',
        rewards: { food: [1, 3], water: [0, 1], materials: [0, 2], bandage: [0, 1] }
    },
    {
        id: 'garage',
        name: 'Garage local',
        risk: 34,
        loot: 'matériaux',
        desc: 'Ferraille, outils et bazar mécanique.',
        rewards: { materials: [1, 3], water: [0, 1], fuel: [0, 1] }
    },
    {
        id: 'apartment',
        name: 'Appartement vide',
        risk: 30,
        loot: 'eau',
        desc: 'Peu de place, peu de bruit, peu de surprise.',
        rewards: { food: [0, 2], water: [1, 2], bandage: [0, 1] }
    },
    {
        id: 'shop',
        name: 'Petite supérette',
        risk: 38,
        loot: 'provisions',
        desc: 'Quelques rayons encore exploitables.',
        rewards: { food: [1, 3], water: [1, 2], materials: [0, 1] }
    }
];

const dangerousLocations = [
    {
        id: 'hospital',
        name: 'Hôpital',
        risk: 72,
        loot: 'médical',
        cost: { ammo: 2 },
        desc: 'Très riche mais infecté et instable.',
        rewards: { bandage: [2, 4], medicine: [1, 3], food: [0, 1], water: [0, 1] }
    },
    {
        id: 'police',
        name: 'Commissariat',
        risk: 78,
        loot: 'munitions',
        cost: { ammo: 2, fuel: 1 },
        desc: 'Zone tendue avec gros potentiel de loot.',
        rewards: { ammo: [2, 5], materials: [1, 3], bandage: [0, 1] }
    },
    {
        id: 'station',
        name: 'Station-service',
        risk: 64,
        loot: 'carburant',
        cost: { ammo: 1, fuel: 1 },
        desc: 'Exposée mais utile pour durer.',
        rewards: { fuel: [2, 4], water: [0, 1], materials: [1, 2] }
    },
    {
        id: 'warehouse',
        name: 'Entrepôt',
        risk: 70,
        loot: 'gros stock',
        cost: { ammo: 2 },
        desc: 'Grand espace, gros bruit, bonne rentabilité.',
        rewards: { food: [2, 5], materials: [2, 5], water: [1, 2] }
    }
];

const buildingDefs = [
    { id: 'rainCollector', name: 'Récupérateur d’eau', desc: 'Produit de l’eau pendant la pluie.', cost: { materials: 4 } },
    { id: 'garden', name: 'Petit potager', desc: 'Produit de la nourriture tous les quelques jours.', cost: { materials: 5, water: 1 } },
    { id: 'medicalCorner', name: 'Coin médical', desc: 'Rend les soins plus efficaces.', cost: { materials: 4, medicine: 1 } },
    { id: 'bed', name: 'Lit amélioré', desc: 'Dormir récupère davantage d’énergie.', cost: { materials: 3, food: 1 } }
];

const simpleEvents = [
    {
        title: 'Placard oublié',
        text: 'Un meuble mal fermé contient encore quelque chose.',
        choices: [
            {
                label: 'Fouiller',
                desc: 'Petit gain possible',
                effect(s) {
                    s.inventory.food += 1;
                    s.statsSummary.resourcesFound += 1;
                    addLog('Placard oublié', 'Tu trouves une ration coincée derrière une boîte vide.', 'Événement');
                    toast('Petit gain', '+1 ration.', 'success');
                }
            },
            {
                label: 'Laisser',
                desc: 'Ne pas perdre de temps',
                effect(s) {
                    s.stats.stress = clamp(s.stats.stress - 1);
                    addLog('Prudence', 'Tu laisses tomber pour éviter de traîner.', 'Événement');
                    toast('Prudence', 'Tu gardes le contrôle.', 'info');
                }
            }
        ]
    },
    {
        title: 'Coupure sale',
        text: 'En forçant un tiroir, tu te coupes sur un éclat rouillé.',
        choices: [
            {
                label: 'Continuer',
                desc: 'Risque d’infection',
                effect(s) {
                    s.stats.health = clamp(s.stats.health - 4);
                    s.stats.infection = clamp(s.stats.infection + 8);
                    addLog('Coupure sale', 'La blessure est légère, mais l’infection monte.', 'Danger');
                    toast('Infection', 'Infection +8. Santé -4.', 'danger');
                }
            },
            {
                label: 'Rentrer',
                desc: 'Limiter les dégâts',
                effect(s) {
                    s.stats.health = clamp(s.stats.health - 2);
                    s.stats.infection = clamp(s.stats.infection + 3);
                    addLog('Retour rapide', 'Tu rentres immédiatement après la coupure.', 'Danger');
                    toast('Blessure', 'Infection +3. Santé -2.', 'warning');
                }
            }
        ]
    }
];

const dangerousEvents = [
    {
        title: 'Air contaminé',
        text: 'L’air du bâtiment te brûle la gorge et les yeux.',
        choices: [
            {
                label: 'Forcer encore un peu',
                desc: 'Loot possible, infection',
                effect(s) {
                    s.stats.infection = clamp(s.stats.infection + 12);
                    s.inventory.medicine += 1;
                    s.statsSummary.resourcesFound += 1;
                    addLog('Air contaminé', 'Tu insistes malgré l’air toxique et récupères un médicament.', 'Danger');
                    toast('Air contaminé', 'Infection +12, +1 médicament.', 'danger');
                }
            },
            {
                label: 'Sortir vite',
                desc: 'Rester prudent',
                effect(s) {
                    s.stats.stress = clamp(s.stats.stress - 1);
                    addLog('Repli prudent', 'Tu préfères sortir avant d’aggraver ton état.', 'Danger');
                    toast('Prudence', 'Tu évites le pire.', 'info');
                }
            }
        ]
    },
    {
        title: 'Salle infestée',
        text: 'Une zone très exposée semble cacher un gros stock.',
        choices: [
            {
                label: 'Tenter le tout pour le tout',
                desc: 'Risque élevé, gros gain',
                effect(s) {
                    s.stats.health = clamp(s.stats.health - 6);
                    s.stats.infection = clamp(s.stats.infection + 10);
                    s.inventory.materials += 2;
                    s.statsSummary.resourcesFound += 2;
                    addLog('Salle infestée', 'Tu forces le passage et ressors avec du matériel.', 'Danger');
                    toast('Sortie brutale', 'Santé -6, infection +10, +2 matériaux.', 'danger');
                }
            },
            {
                label: 'Abandonner',
                desc: 'Ne pas tout risquer',
                effect(s) {
                    s.stats.morale = clamp(s.stats.morale - 2);
                    addLog('Occasion perdue', 'Tu préfères rester vivant que tenter l’impossible.', 'Danger');
                    toast('Retrait', 'Tu laisses le butin derrière toi.', 'warning');
                }
            }
        ]
    }
];

function initialState() {
    return {
        day: 1,
        timeIndex: 0,
        location: 'Abri',
        weather: 'clear',
        shelter: 58,
        noise: 18,
        danger: 22,
        lastSavedAt: null,
        nightGuard: 0,
        deathReason: null,
        statsSummary: {
            explorations: 0,
            attacks: 0,
            resourcesFound: 0
        },
        buildings: {
            rainCollector: { built: false },
            garden: { built: false, lastHarvestDay: 1 },
            medicalCorner: { built: false },
            bed: { built: false }
        },
        colony: {
            founded: false,
            name: 'Colonie du Dernier Feu',
            level: 0,
            morale: 58,
            dailyFood: 0,
            dailyWater: 0,
            dailyMedicine: 0,
            defense: 0,
            capacity: 0,
            unlockDay: 30,
            recruitCooldown: 0,
            upgrades: {
                walls: 0,
                dormitory: 0,
                clinic: 0,
                workshop: 0,
                garden: 0,
                waterStation: 0,
                tower: 0
            },
            colonists: []
        },
        inventory: {
            food: 4,
            water: 4,
            bandage: 2,
            medicine: 0,
            ammo: 3,
            materials: 5,
            fuel: 1
        },
        stats: {
            health: 84,
            hunger: 68,
            thirst: 70,
            energy: 76,
            morale: 61,
            infection: 8,
            stress: 34
        },
        log: []
    };
}

let state = normalizeState(initialState());

const statsConfig = [
    { key: 'health', label: 'Santé', tone: 'success' },
    { key: 'hunger', label: 'Faim', tone: 'warning' },
    { key: 'thirst', label: 'Soif', tone: 'warning' },
    { key: 'energy', label: 'Énergie', tone: 'success' },
    { key: 'morale', label: 'Moral', tone: 'success' },
    { key: 'infection', label: 'Infection', tone: 'danger' },
    { key: 'stress', label: 'Stress', tone: 'danger' }
];

const $ = id => document.getElementById(id);

const startScreen = $('startScreen');
const gameApp = $('gameApp');
const continueBtn = $('continueBtn');
const newGameBtn = $('newGameBtn');
const resetSaveBtn = $('resetSaveBtn');
const saveNowBtn = $('saveNowBtn');
const stickyActions = $('stickyActions');

const buildingsToggle = $('buildingsToggle');
const simpleToggle = $('simpleToggle');
const dangerousToggle = $('dangerousToggle');
const journalToggle = $('journalToggle');
const colonyToggle = $('colonyToggle');

const buildingsContent = $('buildingsContent');
const simpleContent = $('simpleContent');
const dangerousContent = $('dangerousContent');
const journalContent = $('journalContent');
const colonyContent = $('colonyContent');

const moreActionsBtn = $('moreActionsBtn');
const moreActionsPanel = $('moreActionsPanel');

const stickyVitals = $('stickyVitals');
const stickyResources = $('stickyResources');
const statusSummary = $('statusSummary');
const statsGrid = $('statsGrid');
const statusChips = $('statusChips');
const overviewGrid = $('overviewGrid');
const inventoryList = $('inventoryList');
const journalDays = $('journalDays');
const dayLabel = $('dayLabel');
const timeLabel = $('timeLabel');
const locationLabel = $('locationLabel');
const simpleLocationsGrid = $('simpleLocationsGrid');
const dangerousLocationsGrid = $('dangerousLocationsGrid');
const buildingsGrid = $('buildingsGrid');
const saveStateLabel = $('saveStateLabel');
const weatherLabel = $('weatherLabel');
const ambienceText = $('ambienceText');
const colonyPanel = $('colonyPanel');
const colonyHeadText = $('colonyHeadText');
const colonyPhaseBadge = $('colonyPhaseBadge');
const gameOverScreen = $('gameOverScreen');
const gameOverReason = $('gameOverReason');
const gameOverStats = $('gameOverStats');
const restartBtn = $('restartBtn');
const backMenuBtn = $('backMenuBtn');
const eventModal = $('eventModal');
const eventTitle = $('eventTitle');
const eventText = $('eventText');
const eventChoices = $('eventChoices');

document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => handleAction(btn.dataset.action));
});

continueBtn.addEventListener('click', continueGame);
newGameBtn.addEventListener('click', startNewGame);
resetSaveBtn.addEventListener('click', resetSave);
saveNowBtn.addEventListener('click', () => {
    save();
    toast('Sauvegarde', 'Partie sauvegardée.', 'success');
});
restartBtn.addEventListener('click', () => {
    gameOverScreen.classList.add('hidden');
    startNewGame();
});
backMenuBtn.addEventListener('click', () => {
    gameOverScreen.classList.add('hidden');
    toggleGame(false);
});
moreActionsBtn.addEventListener('click', () => {
    moreActionsPanel.classList.toggle('hidden');
});

buildingsToggle.addEventListener('click', () => toggleAccordion(buildingsToggle, buildingsContent));
simpleToggle.addEventListener('click', () => toggleAccordion(simpleToggle, simpleContent));
dangerousToggle.addEventListener('click', () => toggleAccordion(dangerousToggle, dangerousContent));
journalToggle.addEventListener('click', () => toggleAccordion(journalToggle, journalContent));
if (colonyToggle && colonyContent) colonyToggle.addEventListener('click', () => toggleAccordion(colonyToggle, colonyContent));

function toggleAccordion(trigger, content) {
    const open = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', String(!open));
    content.classList.toggle('hidden', open);
}

function clamp(v, min = 0, max = 100) {
    return Math.max(min, Math.min(max, v));
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
    return arr[randomInt(0, arr.length - 1)];
}

function save() {
    state.lastSavedAt = new Date().toISOString();
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    renderSaveLabel();
    continueBtn.disabled = false;
}

function load() {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function createColonistFromTemplate(template, index = 0) {
    return {
        id: `colon_${Date.now()}_${Math.random().toString(36).slice(2, 7)}_${index}`,
        name: template.name,
        age: template.age,
        rarity: template.rarity,
        trait: template.trait,
        role: template.role,
        status: 'idle',
        health: randomInt(72, 96),
        morale: randomInt(58, 82),
        fatigue: randomInt(10, 32),
        skills: { ...template.skills },
        consumption: { food: 2, water: 1, medicine: 0 }
    };
}

function normalizeState(raw) {
    const base = initialState();
    const next = { ...base, ...raw };
    next.inventory = { ...base.inventory, ...(raw?.inventory || {}) };
    next.stats = { ...base.stats, ...(raw?.stats || {}) };
    next.statsSummary = { ...base.statsSummary, ...(raw?.statsSummary || {}) };
    next.buildings = { ...base.buildings, ...(raw?.buildings || {}) };
    next.colony = { ...base.colony, ...(raw?.colony || {}) };
    next.colony.upgrades = { ...base.colony.upgrades, ...(raw?.colony?.upgrades || {}) };
    next.colony.colonists = (raw?.colony?.colonists || []).map((c, i) => ({
        id: c.id || `colon_restore_${i}`,
        name: c.name || `Colon ${i + 1}`,
        age: c.age || randomInt(24, 46),
        rarity: c.rarity || 'common',
        trait: c.trait || 'Survivant',
        role: c.role || 'rest',
        status: c.status || 'idle',
        health: typeof c.health === 'number' ? c.health : randomInt(70, 92),
        morale: typeof c.morale === 'number' ? c.morale : randomInt(55, 78),
        fatigue: typeof c.fatigue === 'number' ? c.fatigue : randomInt(8, 28),
        skills: { exploration: 4, defense: 4, medicine: 4, construction: 4, production: 4, ...(c.skills || {}) },
        consumption: { food: 2, water: 1, medicine: 0, ...(c.consumption || {}) }
    }));
    updateColonyDerivedStats(next);
    return next;
}

function toggleGame(show) {
    startScreen.classList.toggle('hidden', show);
    gameApp.classList.toggle('hidden', !show);
    stickyActions.classList.toggle('hidden', !show);
}

function addLog(title, text, tag = 'Système') {
    state.log.unshift({
        title,
        text,
        tag,
        time: `Jour ${state.day} • ${timeSlots[state.timeIndex]}`
    });
    state.log = state.log.slice(0, 24);
}

function toast(title, message, type = 'info', duration = 2600) {
    const c = $('toastContainer');
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `
    <div class="toast-top">
      <div class="toast-title">${title}</div>
      <button class="toast-close">×</button>
    </div>
    <div class="toast-message">${message}</div>
  `;
    const rm = () => {
        if (!t.isConnected) return;
        t.classList.add('hide');
        setTimeout(() => {
            if (t.isConnected) t.remove();
        }, 240);
    };
    t.querySelector('.toast-close').addEventListener('click', rm);
    c.prepend(t);
    setTimeout(rm, duration);
}

function getWeatherLabel(id) {
    return weatherDefs.find(x => x.id === id)?.label || '☀️ Temps clair';
}

function rollWeather() {
    state.weather = pick(weatherDefs).id;
}

function getEnergyState(value = state.stats.energy) {
    if (value >= 75) return 'En forme';
    if (value >= 50) return 'Fatigué';
    if (value >= 25) return 'Très fatigué';
    return 'Épuisé';
}

function getStressState(value = state.stats.stress) {
    if (value < 25) return 'Calme';
    if (value < 50) return 'Sous tension';
    if (value < 75) return 'Stress élevé';
    return 'Au bord de la panique';
}

function getSleepRecovery() {
    let recovery = state.buildings.bed.built ? randomInt(24, 32) : randomInt(16, 24);

    if (state.stats.hunger < 25) recovery -= 6;
    if (state.stats.thirst < 25) recovery -= 8;
    if (state.stats.stress > 70) recovery -= 10;
    else if (state.stats.stress > 50) recovery -= 5;
    if (state.stats.infection > 40) recovery -= 8;
    else if (state.stats.infection > 20) recovery -= 4;
    if (state.stats.health < 35) recovery -= 4;

    return Math.max(6, recovery);
}

function canDoDangerousExploration() {
    if (state.stats.energy < 25) {
        toast('Trop épuisé', 'Impossible de lancer une expédition dangereuse avec une énergie aussi basse.', 'warning');
        return false;
    }
    if (state.stats.stress > 85) {
        toast('Panique', 'Tu es trop stressé pour tenter une expédition dangereuse.', 'warning');
        return false;
    }
    if (state.stats.health < 20) {
        toast('Trop affaibli', 'Ton état physique ne permet pas une expédition dangereuse.', 'warning');
        return false;
    }
    return true;
}

function applyLowStateEffects() {
    if (state.stats.energy < 30) {
        state.stats.stress = clamp(state.stats.stress + 3);
    }

    if (state.stats.hunger < 25) {
        state.stats.stress = clamp(state.stats.stress + 2);
    }

    if (state.stats.thirst < 25) {
        state.stats.stress = clamp(state.stats.stress + 3);
    }

    if (state.stats.infection > 35) {
        state.stats.stress = clamp(state.stats.stress + 2);
        state.stats.energy = clamp(state.stats.energy - 2);
    }

    if (state.stats.stress > 70) {
        state.stats.energy = clamp(state.stats.energy - 2);
    }

    if (state.stats.stress > 85) {
        state.stats.morale = clamp(state.stats.morale - 3);
    }
}

function getExplorationEnergyCost(mode) {
    let min = mode === 'dangerous' ? 14 : 10;
    let max = mode === 'dangerous' ? 22 : 16;

    if (state.stats.energy < 40) {
        min += 3;
        max += 5;
    }

    if (state.stats.stress > 60) {
        min += 2;
        max += 4;
    }

    return randomInt(min, max);
}

function getExplorationStressGain(mode) {
    let min = mode === 'dangerous' ? 6 : 2;
    let max = mode === 'dangerous' ? 12 : 6;

    if (state.stats.energy < 35) {
        min += 2;
        max += 4;
    }

    if (state.stats.infection > 25) {
        min += 1;
        max += 3;
    }

    return randomInt(min, max);
}

function getStatusSummary() {
    if (state.shelter <= 15) return 'Abri critique';
    if (state.stats.health <= 25) return 'État critique';
    if (state.stats.infection >= 50) return 'Infection préoccupante';
    if (state.stats.thirst <= 25) return 'Déshydratation imminente';
    if (state.stats.hunger <= 25) return 'Famine en approche';
    if (state.stats.stress >= 85) return 'Au bord de la panique';
    if (state.stats.stress >= 65) return 'Stress très élevé';
    if (state.stats.energy <= 20) return 'Épuisement sévère';
    return 'Situation stable';
}

function getRoleLabel(role) {
    return {
        exploration: 'Éclaireur',
        defense: 'Garde',
        medicine: 'Soins',
        construction: 'Construction',
        production: 'Production',
        rest: 'Repos'
    }[role] || 'Survivant';
}

function getRoleClass(role) {
    return {
        exploration: 'role-explorer',
        defense: 'role-defender',
        medicine: 'role-medic',
        construction: 'role-builder',
        production: 'role-producer',
        rest: 'role-support'
    }[role] || 'role-support';
}

function getRarityLabel(r) {
    return { common: 'Commun', rare: 'Rare', elite: 'Élite', legendary: 'Légendaire' }[r] || 'Commun';
}

function getColonStatusLabel(status) {
    return {
        mission: 'Mission',
        guarding: 'Garde',
        resting: 'Repos',
        working: 'Travail',
        idle: 'Disponible'
    }[status] || 'Disponible';
}

function getRoleEffectText(role, colon) {
    if (role === 'exploration') return `Trouve env. ${Math.max(2, Math.round(colon.skills.exploration / 2))} ressources et repère de nouvelles zones.`;
    if (role === 'defense') return `Ajoute +${Math.max(3, Math.round(colon.skills.defense / 1.8))} défense à la colonie.`;
    if (role === 'medicine') return `Soigne jusqu’à ${Math.max(4, Math.round(colon.skills.medicine / 2))} PV par jour.`;
    if (role === 'construction') return `Renforce l’abri et génère des matériaux en continu.`;
    if (role === 'production') return `Produit env. +${Math.max(1, Math.round(colon.skills.production / 4))}🍖 et +${Math.max(1, Math.round(colon.skills.production / 4))}💧.`;
    return 'Récupère plus vite la santé, le moral et la fatigue.';
}

function renderRoleAssignment(colon) {
    return colonRoles.map(role => `<button class="role-chip ${colon.role === role ? 'active' : ''}" data-colon-role="${colon.id}|${role}">${getRoleLabel(role)}</button>`).join('');
}

function getColonyCapacity(colony = state.colony) {
    return 4 + (colony.upgrades.dormitory || 0) * 2;
}

function getColonyUpgradeBonus(colony = state.colony) {
    const u = colony.upgrades || {};

    const walls = u.walls || 0;
    const tower = u.tower || 0;
    const garden = u.garden || 0;
    const waterStation = u.waterStation || 0;
    const workshop = u.workshop || 0;
    const clinic = u.clinic || 0;

    return {
        defense: walls * 8 + Math.max(0, walls - 1) * 4 + tower * 4 + Math.max(0, tower - 1) * 2,
        food: garden * 2 + Math.max(0, garden - 1) * 2,
        water: waterStation * 2 + Math.max(0, waterStation - 1) * 2,
        workshop: workshop * 2 + Math.max(0, workshop - 1),
        clinic: clinic * 4 + Math.max(0, clinic - 1) * 2
    };
}

function updateColonyDerivedStats(target = state) {
    const colony = target.colony;
    colony.capacity = getColonyCapacity(colony);
    colony.level = colony.founded ? 1 + Math.floor((Object.values(colony.upgrades).reduce((a, b) => a + b, 0)) / 2) : 0;

    const colonists = colony.colonists || [];
    const bonus = getColonyUpgradeBonus(colony);

    const assigned = {
        exploration: colonists.filter(c => c.role === 'exploration'),
        defense: colonists.filter(c => c.role === 'defense'),
        medicine: colonists.filter(c => c.role === 'medicine'),
        construction: colonists.filter(c => c.role === 'construction'),
        production: colonists.filter(c => c.role === 'production'),
        rest: colonists.filter(c => c.role === 'rest')
    };

    colony.dailyFood = bonus.food + assigned.production.reduce((sum, c) => sum + Math.max(1, Math.round(c.skills.production / 3.5)), 0);
    colony.dailyWater = bonus.water + assigned.production.reduce((sum, c) => sum + Math.max(1, Math.round(c.skills.production / 4)), 0);
    colony.dailyMedicine = assigned.medicine.reduce((sum, c) => sum + (c.skills.medicine >= 7 ? 1 : 0), 0);

    colony.defense = bonus.defense + assigned.defense.reduce((sum, c) => sum + Math.max(3, Math.round(c.skills.defense / 1.8)), 0);

    colony.scavengePower = assigned.exploration.reduce((sum, c) => sum + c.skills.exploration, 0);
    colony.buildPower = bonus.workshop + assigned.construction.reduce((sum, c) => sum + c.skills.construction, 0);
    colony.medicalPower = bonus.clinic + assigned.medicine.reduce((sum, c) => sum + c.skills.medicine, 0);
    colony.productionPower = bonus.food + bonus.water + assigned.production.reduce((sum, c) => sum + c.skills.production, 0);
    colony.restPower = assigned.rest.reduce((sum, c) => sum + Math.max(2, Math.round((100 - c.fatigue) / 10)), 0);

    colony.morale = clamp(
        colonists.length
            ? Math.round(colonists.reduce((s, c) => s + c.morale, 0) / colonists.length)
            : colony.morale
    );
}

function foundColony() {
    if (state.day < state.colony.unlockDay) {
        toast('Trop tôt', `La colonie se débloque au jour ${state.colony.unlockDay}.`, 'warning');
        return;
    }
    if (state.colony.founded) {
        toast('Colonie active', 'Votre communauté est déjà en place.', 'info');
        return;
    }
    if (!payCost(colonyFoundingCost)) {
        toast('Fondation impossible', 'Il manque des ressources pour lancer la colonie.', 'warning');
        return;
    }
    const starters = [colonyRecruitPool[0], colonyRecruitPool[1], colonyRecruitPool[2]].map((t, i) => createColonistFromTemplate(t, i));
    state.colony.founded = true;
    state.colony.colonists = starters;
    state.colony.recruitCooldown = 1;
    state.colony.upgrades.garden = 1;
    state.colony.upgrades.walls = 1;
    state.location = 'Colonie';
    state.stats.morale = clamp(state.stats.morale + 8);
    addLog('Fondation de la colonie', 'L’abri devient le cœur d’une véritable communauté de survivants.', 'Colonie');
    toast('Colonie fondée', 'La phase 2 de survie commence.', 'success', 3200);
    updateColonyDerivedStats();
    save();
    render();
}

function upgradeColonyBuilding(id) {
    if (!state.colony.founded) return;
    const def = colonyUpgradeDefs.find(x => x.id === id);
    if (!def) return;
    const level = state.colony.upgrades[id] || 0;
    const next = def.levels[level];
    if (!next) {
        toast('Niveau max', 'Cette amélioration est déjà au maximum.', 'info');
        return;
    }
    if (!payCost(next.cost)) {
        toast('Ressources insuffisantes', 'Pas assez de ressources pour cette amélioration.', 'warning');
        return;
    }
    state.colony.upgrades[id] = level + 1;
    addLog('Amélioration colonie', `${def.name} passe au niveau ${level + 1}.`, 'Colonie');
    toast('Amélioration terminée', `${def.name} niveau ${level + 1}.`, 'success');
    updateColonyDerivedStats();
    save();
    render();
}

function assignColonistRole(id, role) {
    const colon = state.colony.colonists.find(c => c.id === id);
    if (!colon || !colonRoles.includes(role)) return;
    colon.role = role;
    colon.status = role === 'rest' ? 'resting' : role === 'defense' ? 'guarding' : 'idle';
    toast('Affectation modifiée', `${colon.name} : ${getRoleLabel(colon.role)}.`, 'info');
    updateColonyDerivedStats();
    save();
    render();
}

function recruitColonist() {
    if (!state.colony.founded) return;
    if (state.colony.colonists.length >= state.colony.capacity) {
        toast('Colonie pleine', 'Améliore le dortoir pour accueillir plus de monde.', 'warning');
        return;
    }
    if (state.colony.recruitCooldown > 0) {
        toast('Aucun contact stable', 'Laisse passer une journée avant une nouvelle tentative.', 'warning');
        return;
    }
    if (!payCost({ food: 2, water: 2 })) {
        toast('Accueil impossible', 'Il faut au moins 2 nourritures et 2 eaux pour accueillir quelqu’un.', 'warning');
        return;
    }
    const used = new Set(state.colony.colonists.map(c => c.name));
    const pool = colonyRecruitPool.filter(c => !used.has(c.name));
    if (!pool.length) {
        toast('Aucun survivant repéré', 'Plus aucun profil disponible pour l’instant.', 'info');
        return;
    }
    const rareChance = Math.random();
    let candidatePool = pool;
    if (rareChance > 0.82) {
        const elites = pool.filter(c => c.rarity !== 'common');
        if (elites.length) candidatePool = elites;
    }
    const template = pick(candidatePool);
    const colon = createColonistFromTemplate(template, state.colony.colonists.length);
    state.colony.colonists.push(colon);
    state.colony.recruitCooldown = 2;
    addLog('Nouveau colon', `${colon.name} rejoint la colonie en tant que ${getRoleLabel(colon.role).toLowerCase()}.`, 'Colonie');
    toast('Nouveau survivant', `${colon.name} rejoint la colonie.`, template.rarity === 'elite' ? 'success' : 'info', 3200);
    updateColonyDerivedStats();
    save();
    render();
}

function processColonyDay() {
    if (!state.colony.founded) return;

    const colony = state.colony;
    updateColonyDerivedStats();

    const bonus = getColonyUpgradeBonus(colony);
    const colonists = colony.colonists;
    const waterStationLevel = colony.upgrades?.waterStation || 0;

    const foodNeed = colonists.reduce((sum, c) => sum + (c.consumption?.food || 2), 0);
    const waterNeed = colonists.reduce((sum, c) => sum + (c.consumption?.water || 1), 0);
    const medicineNeed = Math.max(
        0,
        colonists.filter(c => c.health < 55).length - Math.floor(colony.medicalPower / 12)
    );

    state.inventory.food += colony.dailyFood;
    state.inventory.water += colony.dailyWater;
    state.inventory.medicine += colony.dailyMedicine;

    state.inventory.food -= foodNeed;
    state.inventory.water -= waterNeed;
    state.inventory.medicine = Math.max(0, state.inventory.medicine - medicineNeed);

    if (state.inventory.food < 0) {
        const deficit = Math.abs(state.inventory.food);
        state.inventory.food = 0;
        colonists.forEach(c => {
            c.morale = clamp(c.morale - (6 + deficit));
            c.health = clamp(c.health - 4);
            c.fatigue = clamp(c.fatigue + 8);
        });
        toast('Pénurie de nourriture', 'La colonie manque de rations.', 'danger', 3400);
    }

    if (state.inventory.water < 0) {
        const deficit = Math.abs(state.inventory.water);
        state.inventory.water = 0;
        colonists.forEach(c => {
            c.morale = clamp(c.morale - (8 + deficit));
            c.health = clamp(c.health - 5);
            c.fatigue = clamp(c.fatigue + 10);
        });
        toast('Pénurie d’eau', 'La colonie souffre d’un manque d’eau.', 'danger', 3400);
    }

    colonists.forEach(c => {
        if (c.role === 'exploration') {
            state.inventory.food += Math.max(0, Math.floor(c.skills.exploration / 4) + randomInt(0, 2));
            state.inventory.materials += Math.max(0, Math.floor(c.skills.exploration / 4) + randomInt(0, 2));

            if (Math.random() < 0.45) state.inventory.water += 1;
            if (Math.random() < 0.18) state.inventory.bandage += 1;
            if (Math.random() < 0.12) state.inventory.ammo += 1;

            c.fatigue = clamp(c.fatigue + randomInt(10, 18));
            c.morale = clamp(c.morale + randomInt(1, 4));
            c.status = 'mission';
        }
        else if (c.role === 'defense') {
            c.fatigue = clamp(c.fatigue + randomInt(4, 8));
            c.morale = clamp(c.morale + 2);
            c.status = 'guarding';
        }
        else if (c.role === 'medicine') {
            const weakest = colonists.filter(x => x.health < 96).sort((a, b) => a.health - b.health)[0];

            if (weakest) {
                weakest.health = clamp(
                    weakest.health +
                    Math.max(4, Math.round(c.skills.medicine / 2)) +
                    Math.round(bonus.clinic / 2)
                );
            }

            c.fatigue = clamp(c.fatigue + randomInt(3, 6));
            c.morale = clamp(c.morale + 1);
            c.status = 'working';
        }
        else if (c.role === 'construction') {
            state.inventory.materials += 1 + Math.floor((c.skills.construction + bonus.workshop) / 5);
            state.shelter = clamp(state.shelter + Math.max(1, Math.floor(c.skills.construction / 5)));

            c.fatigue = clamp(c.fatigue + randomInt(5, 9));
            c.status = 'working';
        }
        else if (c.role === 'production') {
            state.inventory.food += Math.max(1, Math.round(c.skills.production / 4));
            state.inventory.water += Math.max(1, Math.round(c.skills.production / 4));

            if (waterStationLevel > 0 && Math.random() < 0.35) {
                state.inventory.water += 1 + Math.floor(waterStationLevel / 2);
            }

            c.fatigue = clamp(c.fatigue + randomInt(4, 8));
            c.status = 'working';
        }
        else {
            c.fatigue = clamp(c.fatigue - randomInt(12, 20));
            c.health = clamp(c.health + randomInt(5, 9));
            c.morale = clamp(c.morale + randomInt(4, 8));
            c.status = 'resting';
        }

        if (c.fatigue > 82) {
            c.health = clamp(c.health - 3);
            c.morale = clamp(c.morale - 4);
        }
    });

    const attackRoll = state.danger + randomInt(0, 20);

    if (attackRoll > colony.defense + 38) {
        const defenders = colonists.filter(c => c.role === 'defense');
        const mitigated = Math.min(defenders.length * 2, 10);
        const damage = randomInt(Math.max(1, 3 - mitigated), Math.max(3, 8 - mitigated));

        state.shelter = clamp(state.shelter - randomInt(4, 10));
        state.stats.stress = clamp(state.stats.stress + 8);

        if (defenders.length) {
            const hit = pick(defenders);
            hit.health = clamp(hit.health - damage);
            hit.morale = clamp(hit.morale - 6);
        }

        addLog('Raid contre la colonie', `La colonie repousse une attaque mais encaisse des dégâts. Défense ${colony.defense}.`, 'Colonie');
        toast('Raid nocturne', 'La colonie a été attaquée.', 'danger', 3200);
    }
    else if (colonists.length) {
        colonists.forEach(c => {
            if (c.role === 'defense') c.morale = clamp(c.morale + 2);
        });

        addLog('Routine de colonie', `La communauté tient bon. Production ${colony.dailyFood} nourriture / ${colony.dailyWater} eau.`, 'Colonie');
    }

    if (colony.recruitCooldown > 0) colony.recruitCooldown -= 1;

    updateColonyDerivedStats();
}

function startNewGame() {
    state = normalizeState(initialState());
    addLog('Début de survie', 'Tu verrouilles l’abri. Les premières sorties décideront de tout.', 'Prologue');
    toggleGame(true);
    save();
    render();
    toast('Nouvelle partie', 'La V6.1 démarre.', 'success');
}

function continueGame() {
    const saved = load();
    if (!saved) {
        toast('Aucune sauvegarde', 'Commence une nouvelle partie.', 'warning');
        return;
    }
    state = normalizeState(saved);
    toggleGame(true);
    render();
    toast('Continuer', 'Sauvegarde chargée.', 'info');
}

function resetSave() {
    localStorage.removeItem(SAVE_KEY);
    continueBtn.disabled = true;
    toast('Sauvegarde effacée', 'La progression enregistrée a été supprimée.', 'warning');
}

function payCost(cost) {
    for (const [k, v] of Object.entries(cost)) {
        if ((state.inventory[k] || 0) < v) return false;
    }
    for (const [k, v] of Object.entries(cost)) {
        state.inventory[k] -= v;
    }
    return true;
}

function buildStructure(id) {
    const def = buildingDefs.find(b => b.id === id);
    if (!def) return;

    if (state.buildings[id].built) {
        toast('Déjà construit', 'Cette amélioration est déjà en place.', 'info');
        return;
    }

    if (!payCost(def.cost)) {
        toast('Ressources insuffisantes', 'Tu n’as pas ce qu’il faut pour construire ça.', 'warning');
        return;
    }

    state.buildings[id].built = true;
    if (id === 'garden') state.buildings[id].lastHarvestDay = state.day;

    addLog('Construction', `${def.name} installé dans l’abri.`, 'Abri');
    toast('Construction terminée', def.name, 'success');
    save();
    render();
}

function applyPassiveProduction() {
    if (state.buildings.rainCollector.built && state.weather === 'rain') {
        const gain = randomInt(1, 3);
        state.inventory.water += gain;
        state.statsSummary.resourcesFound += gain;
        addLog('Récupération d’eau', `Le récupérateur d’eau te fournit ${gain} bouteille(s).`, 'Abri');
        toast('Pluie utile', `+${gain} eau grâce au récupérateur.`, 'success');
    }

    if (state.buildings.garden.built && state.day - state.buildings.garden.lastHarvestDay >= 3) {
        const gain = randomInt(2, 4);
        state.inventory.food += gain;
        state.statsSummary.resourcesFound += gain;
        state.buildings.garden.lastHarvestDay = state.day;
        addLog('Récolte', `Le potager fournit ${gain} ration(s).`, 'Abri');
        toast('Potager', `+${gain} nourriture récoltée.`, 'success');
    }
}

function advanceTime() {
    state.timeIndex += 1;

    state.stats.hunger = clamp(state.stats.hunger - randomInt(5, 9));
    state.stats.thirst = clamp(state.stats.thirst - randomInt(6, 10));
    state.stats.energy = clamp(state.stats.energy - randomInt(4, 7));
    state.stats.morale = clamp(state.stats.morale - randomInt(1, 3));
    state.stats.stress = clamp(state.stats.stress + randomInt(1, 3));
    state.noise = clamp(state.noise - randomInt(1, 3));
    state.danger = clamp(state.danger + randomInt(1, 4));

    applyLowStateEffects();

    if (state.stats.hunger < 25) state.stats.health = clamp(state.stats.health - 4);
    if (state.stats.thirst < 25) state.stats.health = clamp(state.stats.health - 6);
    if (state.stats.energy < 20) state.stats.health = clamp(state.stats.health - 3);
    if (state.stats.infection > 40) state.stats.health = clamp(state.stats.health - 5);

    if (state.timeIndex > 3) {
        state.timeIndex = 0;
        state.day += 1;
        state.location = 'Abri';
        rollWeather();
        applyPassiveProduction();
        processColonyDay();
        nightEvent();
    }

    checkDeath();
}

function nightEvent() {
    let attackRisk = state.danger + state.noise - Math.floor(state.shelter / 2) - state.nightGuard;
    state.nightGuard = 0;

    if (attackRisk > 60) {
        const dmg = randomInt(6, 14);
        const shelterDmg = randomInt(8, 16);
        const stressGain = randomInt(10, 18);

        state.stats.health = clamp(state.stats.health - dmg);
        state.shelter = Math.max(0, state.shelter - shelterDmg);
        state.stats.stress = clamp(state.stats.stress + stressGain);
        state.statsSummary.attacks += 1;

        addLog('Attaque nocturne', `Des rôdeurs frappent l’abri pendant la nuit. Santé -${dmg}, protection -${shelterDmg}, stress +${stressGain}.`, 'Nuit');
        toast('Attaque nocturne', `Santé -${dmg}. Abri -${shelterDmg}. Stress +${stressGain}.`, 'danger');
    } else {
        const energyGain = state.stats.stress > 70 ? 4 : 8;
        const stressDrop = randomInt(2, 5);

        state.stats.energy = clamp(state.stats.energy + energyGain);
        state.stats.stress = clamp(state.stats.stress - stressDrop);

        addLog('Nuit calme', 'La nuit reste tendue mais silencieuse. L’abri tient bon.', 'Nuit');
        toast('Nuit calme', `Énergie +${energyGain}, stress -${stressDrop}.`, 'success');
    }

    checkDeath();
}

function checkDeath() {
    if (state.shelter <= 0) {
        showGameOver("l'abri a cédé");
        return;
    }

    if (state.stats.health > 0) return;

    const reason =
        state.stats.infection >= 75 ? 'infection avancée' :
            state.stats.thirst <= 0 ? 'déshydratation' :
                state.stats.hunger <= 0 ? 'famine' :
                    'blessures trop graves';

    showGameOver(reason);
}

function handleAction(action) {
    if (!moreActionsPanel.classList.contains('hidden')) {
        moreActionsPanel.classList.add('hidden');
    }

    switch (action) {
        case 'sleep': {
            state.location = 'Abri';
            const recovery = getSleepRecovery();
            state.stats.energy = clamp(state.stats.energy + recovery);

            if (state.stats.stress > 70) {
                state.stats.stress = clamp(state.stats.stress - randomInt(3, 6));
            } else {
                state.stats.stress = clamp(state.stats.stress - randomInt(5, 9));
            }

            addLog('Repos', `Tu dors quelques heures. Récupération d’énergie : +${recovery}.`, 'Abri');
            toast('Sommeil', `Énergie +${recovery}. (${getEnergyState(state.stats.energy)})`, 'info');
            advanceTime();
            break;
        }

        case 'eat':
            if (state.inventory.food <= 0) {
                toast('Famine', 'Aucune ration disponible.', 'warning');
                return;
            }
            state.inventory.food -= 1;
            state.stats.hunger = clamp(state.stats.hunger + 24);
            if (state.stats.hunger > 50) {
                state.stats.stress = clamp(state.stats.stress - 2);
            }
            toast('Repas', '1 ration consommée.', 'success');
            break;

        case 'drink':
            if (state.inventory.water <= 0) {
                toast('Déshydratation', 'Aucune eau disponible.', 'warning');
                return;
            }
            state.inventory.water -= 1;
            state.stats.thirst = clamp(state.stats.thirst + 24);
            if (state.stats.thirst > 50) {
                state.stats.stress = clamp(state.stats.stress - 2);
            }
            toast('Hydratation', '1 eau consommée.', 'success');
            break;

        case 'heal':
            if (state.inventory.bandage <= 0) {
                toast('Soin impossible', 'Aucun bandage disponible.', 'warning');
                return;
            }
            state.inventory.bandage -= 1;
            state.stats.health = clamp(state.stats.health + (state.buildings.medicalCorner.built ? 20 : 14));
            state.stats.infection = clamp(state.stats.infection - 8);
            state.stats.stress = clamp(state.stats.stress - 2);
            toast('Soins', 'Tu te remets partiellement sur pied.', 'success');
            break;

        case 'fortify':
            if ((state.inventory.materials || 0) < 2) {
                toast('Abri', 'Pas assez de matériaux.', 'warning');
                return;
            }
            if (state.stats.energy < 15) {
                toast('Trop fatigué', 'Tu es trop épuisé pour renforcer l’abri maintenant.', 'warning');
                return;
            }
            state.inventory.materials -= 2;
            state.shelter = clamp(state.shelter + 14);
            state.stats.energy = clamp(state.stats.energy - randomInt(6, 10));
            state.stats.stress = clamp(state.stats.stress - randomInt(2, 5));
            toast('Protection', 'L’abri est renforcé.', 'success');
            advanceTime();
            break;

        case 'night-watch':
            state.nightGuard = clamp(state.nightGuard + 18, 0, 40);
            state.stats.energy = clamp(state.stats.energy - 8);
            state.stats.stress = clamp(state.stats.stress + 4);
            toast('Veille préparée', 'Le risque nocturne baisse, mais la fatigue augmente.', 'success');
            advanceTime();
            break;

        case 'relax':
            state.stats.stress = clamp(state.stats.stress - randomInt(10, 18));
            state.stats.morale = clamp(state.stats.morale + randomInt(3, 6));
            state.stats.energy = clamp(state.stats.energy + 2);
            addLog('Moment de calme', 'Tu prends quelques minutes pour souffler et laisser la tension redescendre.', 'Mental');
            toast('Se détendre', `Stress : ${getStressState(state.stats.stress)}.`, 'success');
            advanceTime();
            break;

        case 'patrol':
            if (state.stats.energy < 18) {
                toast('Trop fatigué', 'Tu es trop fatigué pour patrouiller autour de l’abri.', 'warning');
                return;
            }
        {
            const reduction = randomInt(6, 10);
            const energyCost = randomInt(8, 12);
            const stressGain = randomInt(2, 5);

            state.danger = clamp(state.danger - reduction);
            state.stats.energy = clamp(state.stats.energy - energyCost);
            state.stats.stress = clamp(state.stats.stress + stressGain);

            addLog('Patrouille', `Tu inspectes les abords de l’abri. Danger extérieur -${reduction}, énergie -${energyCost}, stress +${stressGain}.`, 'Abri');
            toast('Patrouille', `Danger extérieur -${reduction}.`, 'success');
            advanceTime();
        }
            break;

        case 'secure-zone':
            if ((state.inventory.materials || 0) < 3) {
                toast('Matériaux insuffisants', 'Il faut 3 matériaux pour sécuriser le périmètre.', 'warning');
                return;
            }
            if (state.stats.energy < 20) {
                toast('Trop fatigué', 'Tu es trop fatigué pour sécuriser le périmètre.', 'warning');
                return;
            }
        {
            const reduction = randomInt(8, 14);
            const shelterGain = randomInt(15, 20);
            const energyCost = randomInt(8, 12);

            state.inventory.materials -= 3;
            state.danger = clamp(state.danger - reduction);
            state.shelter = clamp(state.shelter + shelterGain);
            state.stats.energy = clamp(state.stats.energy - energyCost);
            state.stats.stress = clamp(state.stats.stress - randomInt(1, 3));

            addLog('Sécurisation', `Tu renforces les abords de l’abri. Danger extérieur -${reduction}, protection +${shelterGain}.`, 'Abri');
            toast('Périmètre sécurisé', `Danger -${reduction}, abri +${shelterGain}.`, 'success');
            advanceTime();
        }
            break;

        case 'clear-threat':
            if ((state.inventory.ammo || 0) < 2) {
                toast('Munitions insuffisantes', 'Il faut 2 munitions pour une élimination ciblée.', 'warning');
                return;
            }
            if (state.stats.energy < 22) {
                toast('Trop fatigué', 'Tu es trop fatigué pour sortir neutraliser une menace.', 'warning');
                return;
            }
        {
            const reduction = randomInt(10, 18);
            const noiseGain = randomInt(5, 10);
            const energyCost = randomInt(10, 14);
            const stressGain = randomInt(3, 6);

            state.inventory.ammo -= 2;
            state.danger = clamp(state.danger - reduction);
            state.noise = clamp(state.noise + noiseGain);
            state.stats.energy = clamp(state.stats.energy - energyCost);
            state.stats.stress = clamp(state.stats.stress + stressGain);

            addLog('Élimination ciblée', `Tu neutralises une menace près de l’abri. Danger extérieur -${reduction}, bruit +${noiseGain}.`, 'Combat');
            toast('Menace réduite', `Danger -${reduction}, mais bruit +${noiseGain}.`, 'warning');
            advanceTime();
        }
            break;

        case 'next':
            addLog('Temps qui passe', 'Tu laisses filer quelques heures dans l’abri.', 'Temps');
            toast('Temps', 'Quelques heures passent.', 'info');
            advanceTime();
            break;
    }

    save();
    render();
}

function runExploration(loc, mode) {
    state.location = loc.name;
    state.statsSummary.explorations += 1;

    const rewards = {};
    Object.entries(loc.rewards).forEach(([k, [min, max]]) => {
        rewards[k] = randomInt(min, max);
    });

    Object.entries(rewards).forEach(([k, v]) => {
        state.inventory[k] = (state.inventory[k] || 0) + v;
        state.statsSummary.resourcesFound += v;
    });

    const energyCost = getExplorationEnergyCost(mode);
    const stressGain = getExplorationStressGain(mode);

    state.stats.energy = clamp(state.stats.energy - energyCost);
    state.stats.thirst = clamp(state.stats.thirst - randomInt(mode === 'dangerous' ? 10 : 8, mode === 'dangerous' ? 16 : 12));
    state.stats.hunger = clamp(state.stats.hunger - randomInt(mode === 'dangerous' ? 8 : 5, mode === 'dangerous' ? 12 : 8));
    state.stats.stress = clamp(state.stats.stress + stressGain);
    state.noise = clamp(state.noise + randomInt(mode === 'dangerous' ? 10 : 6, mode === 'dangerous' ? 18 : 14));
    state.danger = clamp(state.danger + randomInt(mode === 'dangerous' ? 8 : 4, mode === 'dangerous' ? 14 : 10));

    addLog(
        mode === 'dangerous' ? 'Expédition dangereuse' : 'Exploration',
        `Tu fouilles ${loc.name} et récupères ${formatRewardText(rewards)}. Énergie -${energyCost}, stress +${stressGain}.`,
        mode === 'dangerous' ? 'Expédition' : 'Exploration'
    );

    toast(loc.name, `Butin : ${formatRewardText(rewards)}.`, 'success');

    if (Math.random() < (mode === 'dangerous' ? 0.72 : 0.45)) {
        openEvent(pick(mode === 'dangerous' ? dangerousEvents : simpleEvents));
    }

    advanceTime();
    save();
    render();
}

function exploreSimple(id) {
    const loc = simpleLocations.find(l => l.id === id);
    if (!loc) return;

    if (state.stats.energy < 10) {
        toast('Trop épuisé', 'Tu n’as même plus la force pour une sortie simple.', 'warning');
        return;
    }

    runExploration(loc, 'simple');
}

function exploreDangerous(id) {
    const loc = dangerousLocations.find(l => l.id === id);
    if (!loc) return;

    if (!canDoDangerousExploration()) return;

    if (!payCost(loc.cost)) {
        toast('Expédition impossible', costText(loc.cost) + ' requis.', 'warning');
        return;
    }

    addLog('Préparation expédition', `Tu dépenses ${costText(loc.cost)} pour sécuriser la sortie vers ${loc.name}.`, 'Expédition');
    runExploration(loc, 'dangerous');
}

function openEvent(ev) {
    eventTitle.textContent = ev.title;
    eventText.textContent = ev.text;
    eventChoices.innerHTML = '';

    ev.choices.forEach(choice => {
        const b = document.createElement('button');
        b.className = 'btn';
        b.innerHTML = `<strong>${choice.label}</strong><span>${choice.desc}</span>`;
        b.addEventListener('click', () => {
            choice.effect(state);
            eventModal.classList.add('hidden');
            save();
            render();
        });
        eventChoices.appendChild(b);
    });

    eventModal.classList.remove('hidden');
}

function costText(cost) {
    return Object.entries(cost)
        .map(([k, v]) => `${v} ${k === 'ammo' ? 'munition' + (v > 1 ? 's' : '') : k === 'fuel' ? 'carburant' : k}`)
        .join(' + ');
}

function formatRewardText(rewards) {
    const labels = {
        food: 'ration',
        water: 'eau',
        bandage: 'bandage',
        medicine: 'médicament',
        ammo: 'munition',
        materials: 'matériau',
        fuel: 'carburant'
    };

    return Object.entries(rewards)
        .filter(([, v]) => v > 0)
        .map(([k, v]) => `${v} ${labels[k] || k}${v > 1 && k === 'materials' ? 'x' : ''}`)
        .join(', ')
        .replace(/([0-9]+) matériau x/g, '$1 matériaux')
        .replace(/1 matériau x/g, '1 matériau') || 'rien d’utile';
}

function renderSaveLabel() {
    if (!state.lastSavedAt) {
        saveStateLabel.textContent = 'Aucune sauvegarde';
        return;
    }

    const d = new Date(state.lastSavedAt);
    saveStateLabel.textContent = `Sauvegardé à ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function showGameOver(reason) {
    state.deathReason = reason;
    gameOverReason.textContent = `Tu as survécu ${state.day} jour(s). Cause de la mort : ${reason}.`;

    gameOverStats.innerHTML = [
        { label: 'Jours survécus', value: state.day },
        { label: 'Explorations', value: state.statsSummary.explorations },
        { label: 'Ressources trouvées', value: state.statsSummary.resourcesFound },
        { label: 'Attaques nocturnes', value: state.statsSummary.attacks },
        { label: 'Abri final', value: `${state.shelter}%` },
        { label: 'Météo finale', value: getWeatherLabel(state.weather) }
    ].map(item => `
    <article class="game-over-stat">
      <span>${item.label}</span>
      <strong>${item.value}</strong>
    </article>
  `).join('');

    gameOverScreen.classList.remove('hidden');
}

function getChips() {
    const c = [];

    if (state.stats.health <= 35) c.push({ text: 'Blessé', type: 'alert' });
    if (state.stats.infection >= 35) c.push({ text: 'Infection', type: 'alert' });
    if (state.stats.stress >= 75) c.push({ text: 'Panique proche', type: 'alert' });
    else if (state.stats.stress >= 55) c.push({ text: 'Stress élevé', type: 'alert' });

    if (state.stats.energy <= 25) c.push({ text: 'Épuisé', type: 'alert' });
    else if (state.stats.energy <= 45) c.push({ text: 'Très fatigué', type: 'alert' });

    if (state.shelter >= 70) c.push({ text: 'Abri solide', type: 'good' });
    if (state.inventory.water >= 4) c.push({ text: 'Eau suffisante', type: 'good' });
    if (state.buildings.rainCollector.built) c.push({ text: 'Collecteur actif', type: 'good' });
    if (state.buildings.garden.built) c.push({ text: 'Potager', type: 'good' });

    c.push({ text: `Énergie : ${getEnergyState()}`, type: '' });
    c.push({ text: `Stress : ${getStressState()}`, type: '' });

    return c;
}

function getAmbienceText() {
    const time = timeSlots[state.timeIndex];
    const weather = getWeatherLabel(state.weather).replace(/^.. /, '').toLowerCase();

    if (state.stats.stress >= 80) {
        return `Tu sursautes au moindre bruit. ${time} sous ${weather}, et tes nerfs sont presque à bout.`;
    }
    if (state.stats.energy <= 25) {
        return `Ton corps commence à lâcher. ${time}, mais chaque geste te coûte un effort énorme.`;
    }
    if (state.stats.hunger <= 25) {
        return `Ton ventre te serre. ${time} dans l’abri, mais sortir sans manger serait risqué.`;
    }
    if (time === 'Nuit') {
        return `La nuit étouffe les sons puis les amplifie soudainement. Le moindre choc dehors semble tout proche.`;
    }
    if (state.weather === 'rain') {
        return `La pluie tambourine sur le toit. Pour une fois, le mauvais temps peut t’aider à récupérer de l’eau.`;
    }
    if (state.weather === 'fog') {
        return `Le brouillard avale les silhouettes. Dehors, tout paraît plus lent et plus inquiétant.`;
    }
    if (state.weather === 'cold') {
        return `Le froid sec vide doucement tes forces. Même dans l’abri, l’air reste mordant.`;
    }

    return `Le quartier paraît presque vide, mais ce calme n’est jamais rassurant. ${time} sous ${weather}.`;
}

function renderSticky() {
    stickyVitals.innerHTML = [
        ['❤️', 'Santé', state.stats.health],
        ['🍖', 'Faim', state.stats.hunger],
        ['💧', 'Soif', state.stats.thirst],
        ['⚡', 'Énergie', state.stats.energy]
    ].map(([i, l, v]) => `
    <div class="sticky-pill">
      <span class="icon">${i}</span>
      <div>
        <strong>${v}%</strong>
        <span>${l}</span>
      </div>
    </div>
  `).join('');

    stickyResources.innerHTML = [
        ['food', 'Nourriture', state.inventory.food],
        ['water', 'Eau', state.inventory.water],
        ['materials', 'Matériaux', state.inventory.materials],
        ['bandage', 'Bandages', state.inventory.bandage],
        ['ammo', 'Munitions', state.inventory.ammo],
        ['fuel', 'Carburant', state.inventory.fuel]
    ].map(([k, l, v]) => `
    <div class="sticky-pill">
      <span class="icon">${icons[k]}</span>
      <div>
        <strong>${v}</strong>
        <span>${l}</span>
      </div>
    </div>
  `).join('');

    statusSummary.textContent = getStatusSummary();
}

function renderStats() {
    statsGrid.innerHTML = '';

    statsConfig.forEach(item => {
        const value = clamp(state.stats[item.key]);
        const card = document.createElement('article');
        card.className = 'stat';

        const fill = document.createElement('div');
        fill.className = `bar-fill ${item.tone}`;
        fill.style.width = `${value}%`;

        card.innerHTML = `
      <div class="stat-top">
        <span>${item.label}</span>
        <span>${value}%</span>
      </div>
      <div class="bar"></div>
    `;

        card.querySelector('.bar').appendChild(fill);
        statsGrid.appendChild(card);
    });
}

function renderChips() {
    statusChips.innerHTML = '';

    getChips().forEach(ch => {
        const el = document.createElement('div');
        el.className = `chip ${ch.type || ''}`.trim();
        el.textContent = ch.text;
        statusChips.appendChild(el);
    });
}

function renderOverview() {
    const overviewItems = [
        { label: 'Protection abri', value: `${state.shelter}%` },
        { label: 'Niveau de bruit', value: `${state.noise}%` },
        { label: 'Danger extérieur', value: `${state.danger}%` },
        { label: 'Lieu actuel', value: state.location }
    ];

    if (state.colony.founded) {
        overviewItems.push(
            { label: 'Population colonie', value: `${state.colony.colonists.length}/${state.colony.capacity}` },
            { label: 'Défense colonie', value: String(state.colony.defense) }
        );
    }

    overviewGrid.innerHTML = overviewItems.map(i => `
    <article class="info">
      <span>${i.label}</span>
      <strong>${i.value}</strong>
    </article>
  `).join('');
}

function renderBuildings() {
    buildingsGrid.innerHTML = buildingDefs.map(def => {
        const built = state.buildings[def.id].built;

        const costTextLocal = Object.entries(def.cost).map(([k, v]) =>
            `${icons[k] || ''} ${v} ${
                k === 'materials' ? 'matériaux' :
                    k === 'food' ? 'nourriture' :
                        k === 'water' ? 'eau' :
                            k === 'medicine' ? 'médicaments' : k
            }`
        ).join(', ');

        return `
      <article class="building-card">
        <div class="building-top">
          <strong>${def.name}</strong>
          <span class="badge ${built ? 'good' : 'loot'}">${built ? 'Construit' : 'À construire'}</span>
        </div>
        <p class="modal-text">${def.desc}</p>
        <div class="location-meta">
          <span class="badge">${costTextLocal}</span>
        </div>
        <button class="btn ${built ? '' : 'primary'} build-btn" data-building="${def.id}" ${built ? 'disabled' : ''}>
          <strong>${built ? 'Déjà installé' : 'Construire'}</strong>
          <span>${built ? 'Amélioration active dans l’abri' : 'Lancer la construction'}</span>
        </button>
      </article>
    `;
    }).join('');

    document.querySelectorAll('.build-btn').forEach(btn => {
        btn.addEventListener('click', () => buildStructure(btn.dataset.building));
    });
}

function renderSimpleLocations() {
    simpleLocationsGrid.innerHTML = simpleLocations.map(loc => `
    <article class="location-card">
      <div class="location-top">
        <div>
          <strong>${loc.name}</strong>
          <p class="modal-text">${loc.desc}</p>
        </div>
      </div>
      <div class="location-meta">
        <span class="badge">Aucun coût</span>
        <span class="badge loot">Butin ${loc.loot}</span>
        <span class="badge danger">Danger ${loc.risk}%</span>
      </div>
      <button class="btn primary simple-explore-btn" data-location="${loc.id}">
        <strong>Explorer simplement</strong>
        <span>Sortie sans coût d’entrée</span>
      </button>
    </article>
  `).join('');

    document.querySelectorAll('.simple-explore-btn').forEach(btn => {
        btn.addEventListener('click', () => exploreSimple(btn.dataset.location));
    });
}

function renderDangerousLocations() {
    dangerousLocationsGrid.innerHTML = dangerousLocations.map(loc => `
    <article class="location-card">
      <div class="location-top">
        <div>
          <strong>${loc.name}</strong>
          <p class="modal-text">${loc.desc}</p>
        </div>
      </div>
      <div class="location-meta">
        <span class="badge">${costText(loc.cost)}</span>
        <span class="badge loot">Butin ${loc.loot}</span>
        <span class="badge danger">Danger ${loc.risk}%</span>
      </div>
      <button class="btn primary dangerous-explore-btn" data-location="${loc.id}">
        <strong>Lancer l’expédition</strong>
        <span>Coût élevé, meilleur rendement</span>
      </button>
    </article>
  `).join('');

    document.querySelectorAll('.dangerous-explore-btn').forEach(btn => {
        btn.addEventListener('click', () => exploreDangerous(btn.dataset.location));
    });
}

function renderInventory() {
    const labels = {
        food: ['Nourriture', 'Rations et conserves'],
        water: ['Eau', 'Bouteilles récupérées'],
        bandage: ['Bandages', 'Soins d’urgence'],
        medicine: ['Médicaments', 'Antiseptiques et antibiotiques'],
        ammo: ['Munitions', 'Derniers chargeurs'],
        materials: ['Matériaux', 'Planches, métal, outils'],
        fuel: ['Carburant', 'Réserves rares']
    };

    inventoryList.innerHTML = Object.entries(state.inventory).map(([k, v]) => {
        const [l, d] = labels[k] || [k, 'Ressource'];

        return `
      <article class="loot-row">
        <div>
          <span class="icon">${icons[k] || '📦'}</span>
          <div>
            <strong>${l}</strong>
            <small>${d}</small>
          </div>
        </div>
        <strong>x${v}</strong>
      </article>
    `;
    }).join('');
}

function renderColony() {
    if (!colonyPanel) return;

    if (!state.colony.founded) {
        const unlocked = state.day >= state.colony.unlockDay;
        colonyHeadText.textContent = unlocked ? 'Votre groupe peut désormais s’étendre et fonder une colonie.' : `Disponible au jour ${state.colony.unlockDay}`;
        colonyPhaseBadge.textContent = unlocked ? 'Transition' : 'Abri';
        colonyPanel.innerHTML = `
            <div class="colony-gate ${unlocked ? 'ready' : ''}">
              <div class="colony-gate-copy">
                <p class="colony-kicker">Phase 2</p>
                <h3>${unlocked ? 'Fonder une vraie colonie' : 'La colonie n’est pas encore disponible'}</h3>
                <p>${unlocked ? 'Après 30 jours, l’abri peut devenir une base durable. Les mêmes ressources que ton inventaire servent à nourrir, défendre et développer la colonie.' : 'Tiens encore quelques jours. Une fois le cap des 30 jours passé, tu pourras transformer ton abri en une vraie communauté de survivants.'}</p>
                <div class="colony-cost-line">${Object.entries(colonyFoundingCost).map(([k, v]) => `<span>${icons[k] || '📦'} ${v}</span>`).join('')}</div>
              </div>
              <div class="colony-gate-cta">
                <div class="colony-gate-card">
                  <strong>${unlocked ? 'Tout est prêt pour la phase colonie.' : `Jour ${state.day} / ${state.colony.unlockDay}`}</strong>
                  <small>${unlocked ? 'Nouveaux colons, bâtiments coloniaux, défense avancée.' : 'Survis encore pour débloquer cette étape.'}</small>
                </div>
                <button class="btn primary colony-main-btn" id="foundColonyBtn" ${unlocked ? '' : 'disabled'}>
                  <strong>Fonder la colonie</strong>
                  <span>${unlocked ? 'Passer de l’abri à une communauté organisée' : 'Encore quelques jours de survie'}</span>
                </button>
              </div>
            </div>
        `;
        const btn = $('foundColonyBtn');
        if (btn) btn.addEventListener('click', foundColony);
        return;
    }

    updateColonyDerivedStats();
    colonyHeadText.textContent = `Population ${state.colony.colonists.length}/${state.colony.capacity} • Production ${state.colony.dailyFood}🍖 ${state.colony.dailyWater}💧`;
    colonyPhaseBadge.textContent = `Niv. ${state.colony.level}`;

    const upgradesHtml = colonyUpgradeDefs.map(def => {
        const level = state.colony.upgrades[def.id] || 0;
        const next = def.levels[level];
        const maxed = !next;
        return `
          <article class="colony-upgrade-card ${getRoleClass(def.role)}">
            <div class="colony-upgrade-top">
              <div>
                <strong>${def.name}</strong>
                <small>${def.desc}</small>
              </div>
              <span class="badge ${maxed ? 'good' : 'loot'}">Niv. ${level}${maxed ? ' • Max' : ''}</span>
            </div>
            <div class="colony-upgrade-bottom">
              <div class="colony-upgrade-bonus">${maxed ? 'Amélioration maximale' : next.bonus}</div>
              <button class="btn ${maxed ? '' : 'primary'} colony-upgrade-btn" data-upgrade="${def.id}" ${maxed ? 'disabled' : ''}>
                <strong>${maxed ? 'Max atteint' : 'Améliorer'}</strong>
                <span>${maxed ? 'Aucun niveau supplémentaire' : Object.entries(next.cost).map(([k, v]) => `${icons[k] || '📦'} ${v}`).join(' • ')}</span>
              </button>
            </div>
          </article>
        `;
    }).join('');

    const colonHtml = state.colony.colonists.map(colon => {
        const initials = colon.name.split(' ').map(x => x[0]).slice(0, 2).join('').toUpperCase();
        return `
          <article class="colon-card ${getRoleClass(colon.role)} rarity-${colon.rarity} status-${colon.status}">
            <div class="colon-card-top">
              <div class="colon-avatar-wrap">
                <div class="colon-avatar">${initials}</div>
                <span class="rarity-pill">${getRarityLabel(colon.rarity)}</span>
              </div>
              <div class="colon-identity">
                <h3>${colon.name}</h3>
                <p>${colon.age} ans • ${getRoleLabel(colon.role)}</p>
              </div>
              <div class="status-pill">${getColonStatusLabel(colon.status)}</div>
            </div>
            <div class="colon-meta">
              <span class="meta-chip">Trait : ${colon.trait}</span>
              <span class="meta-chip">Spécialité : ${getRoleLabel(Object.entries(colon.skills).sort((a, b) => b[1] - a[1])[0][0])}</span>
            </div>
            <div class="colon-stats">
              ${[
            ['Santé', colon.health, ''],
            ['Moral', colon.morale, ''],
            ['Fatigue', colon.fatigue, 'danger']
        ].map(([label, value, tone]) => `
                <div class="stat-row">
                  <div class="stat-label-line"><span>${label}</span><strong>${value}%</strong></div>
                  <div class="stat-bar ${tone}"><span style="width:${value}%"></span></div>
                </div>
              `).join('')}
            </div>
            <div class="skills-row">
              <div class="skill-box"><span>Exploration</span><strong>${colon.skills.exploration}</strong></div>
              <div class="skill-box"><span>Défense</span><strong>${colon.skills.defense}</strong></div>
              <div class="skill-box"><span>Médecine</span><strong>${colon.skills.medicine}</strong></div>
              <div class="skill-box"><span>Construction</span><strong>${colon.skills.construction}</strong></div>
            </div>
            <div class="consumption-row">
              <span>Conso / jour</span>
              <div class="consumption-tags">
                <span>🍖 ${colon.consumption.food}</span>
                <span>💧 ${colon.consumption.water}</span>
                <span>💊 ${colon.consumption.medicine}</span>
              </div>
            </div>
            <div class="colon-role-note">${getRoleEffectText(colon.role, colon)}</div>
            <div class="colon-actions">
              <div class="role-chip-row">${renderRoleAssignment(colon)}</div>
            </div>
          </article>
        `;
    }).join('');

    colonyPanel.innerHTML = `
      <div class="colony-dashboard">
        <div class="colony-overview-grid">
          <article class="colony-overview-card"><span>Niveau colonie</span><strong>${state.colony.level}</strong></article>
          <article class="colony-overview-card"><span>Moral global</span><strong>${state.colony.morale}%</strong></article>
          <article class="colony-overview-card"><span>Défense</span><strong>${state.colony.defense}</strong></article>
          <article class="colony-overview-card"><span>Population</span><strong>${state.colony.colonists.length}/${state.colony.capacity}</strong></article>
          <article class="colony-overview-card"><span>Prod. nourriture</span><strong>+${state.colony.dailyFood}/j</strong></article>
          <article class="colony-overview-card"><span>Prod. eau</span><strong>+${state.colony.dailyWater}/j</strong></article>
        </div>

        <div class="colony-action-strip">
          <button class="btn primary colony-main-btn" id="recruitColonBtn">
            <strong>Recruter un colon</strong>
            <span>Coût : 🍖 2 • 💧 2 ${state.colony.recruitCooldown > 0 ? `• Attente ${state.colony.recruitCooldown} j` : ''}</span>
          </button>
          <div class="colony-mini-note">Les ressources utilisées viennent du même inventaire que le joueur. Les affectations ont maintenant un vrai impact sur l’eau, la défense, les soins et la production.</div>
        </div>

        <div class="colony-role-summary">
          <span>Éclaireurs : ${state.colony.colonists.filter(c => c.role === 'exploration').length}</span>
          <span>Gardes : ${state.colony.colonists.filter(c => c.role === 'defense').length}</span>
          <span>Soins : ${state.colony.colonists.filter(c => c.role === 'medicine').length}</span>
          <span>Construction : ${state.colony.colonists.filter(c => c.role === 'construction').length}</span>
          <span>Production : ${state.colony.colonists.filter(c => c.role === 'production').length}</span>
          <span>Repos : ${state.colony.colonists.filter(c => c.role === 'rest').length}</span>
        </div>

        <div class="colony-upgrades-grid">${upgradesHtml}</div>

        <div class="colon-grid">${colonHtml}</div>
      </div>
    `;

    const recruitBtn = $('recruitColonBtn');
    if (recruitBtn) recruitBtn.addEventListener('click', recruitColonist);
    colonyPanel.querySelectorAll('.colony-upgrade-btn').forEach(btn => btn.addEventListener('click', () => upgradeColonyBuilding(btn.dataset.upgrade)));
    colonyPanel.querySelectorAll('[data-colon-role]').forEach(btn => btn.addEventListener('click', () => {
        const [id, role] = btn.dataset.colonRole.split('|');
        assignColonistRole(id, role);
    }));
}

function renderJournal() {
    const groups = {};

    state.log.forEach(entry => {
        const m = entry.time.match(/Jour\s+(\d+)/);
        const day = m ? m[1] : '?';
        (groups[day] || (groups[day] = [])).push(entry);
    });

    const days = Object.keys(groups).sort((a, b) => Number(b) - Number(a));

    journalDays.innerHTML = days.map(day => `
    <section class="journal-day">
      <h3>Jour ${day}</h3>
      <div class="journal-entries">
        ${groups[day].map(e => `
          <article class="entry">
            <div class="entry-meta">
              <span>${e.tag}</span>
              <span>${e.time.replace(/^Jour\s+\d+\s+•\s+/, '')}</span>
            </div>
            <strong>${e.title}</strong>
            <p>${e.text}</p>
          </article>
        `).join('')}
      </div>
    </section>
  `).join('');
}

function renderHeader() {
    dayLabel.textContent = state.day;
    timeLabel.textContent = timeSlots[state.timeIndex];
    locationLabel.textContent = state.location;
    renderSaveLabel();
    weatherLabel.textContent = getWeatherLabel(state.weather);
    ambienceText.textContent = getAmbienceText();
}

function render() {
    renderHeader();
    renderSticky();
    renderStats();
    renderChips();
    renderOverview();
    renderBuildings();
    renderColony();
    renderSimpleLocations();
    renderDangerousLocations();
    renderInventory();
    renderJournal();
}

(function init() {
    const saved = load();
    continueBtn.disabled = !saved;
    if (saved) state = normalizeState(saved);
})();