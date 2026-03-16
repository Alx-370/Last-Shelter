const SAVE_KEY = 'last_shelter_Save';

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
    fuel: '⛽',
    power: '🔋'
};

const rarityWeights = {
    common: 60,
    rare: 25,
    elite: 10,
    legendary: 5
};

const resourceLabels = {
    food: 'nourriture',
    water: 'eau',
    bandage: 'bandage',
    medicine: 'médicament',
    ammo: 'munition',
    materials: 'matériaux',
    fuel: 'carburant'
};

const merchantBaseValues = {
    food: 2,
    water: 2,
    bandage: 3,
    medicine: 5,
    ammo: 5,
    materials: 4,
    fuel: 6
};

const merchantProfiles = {
    honest: {
        id: 'honest',
        name: 'Marchand honnête',
        badge: 'Échange propre',
        desc: 'Prix assez stables, peu de mauvaises surprises.',
        buyFactor: 0.95,
        sellFactor: 1.05,
        marketBias: { food: 0.95, water: 0.95, bandage: 0.95, medicine: 1, ammo: 1, materials: 1, fuel: 1 }
    },
    opportunist: {
        id: 'opportunist',
        name: 'Marchand opportuniste',
        badge: 'Prix mouvants',
        desc: 'Il profite des pénuries et des périodes difficiles.',
        buyFactor: 1.15,
        sellFactor: 0.88,
        marketBias: { food: 1.1, water: 1.1, bandage: 1, medicine: 1, ammo: 1, materials: 1, fuel: 1.15 }
    },
    arms: {
        id: 'arms',
        name: 'Trafiquant d’armes',
        badge: 'Armé jusqu’aux dents',
        desc: 'Spécialisé en munitions et carburant. Rien n’est gratuit avec lui.',
        buyFactor: 1.18,
        sellFactor: 0.92,
        marketBias: { ammo: 0.75, fuel: 0.86, materials: 0.95, medicine: 1.2, food: 1.15, water: 1.15, bandage: 1.1 }
    },
    doctor: {
        id: 'doctor',
        name: 'Médecin itinérant',
        badge: 'Soins de terrain',
        desc: 'Cherche surtout des médicaments, de l’eau propre et des bandages.',
        buyFactor: 1.04,
        sellFactor: 0.96,
        marketBias: { medicine: 0.74, bandage: 0.82, water: 0.92, ammo: 1.18, fuel: 1.12, materials: 1.08, food: 1 }
    }
};

const lootableResources = ['food', 'water', 'bandage', 'medicine', 'ammo', 'materials', 'fuel'];

const tutorialSlides = [
    {
        title: '1. Le but du jeu',
        text: 'Ton objectif est simple : survivre le plus longtemps possible. Tu dois garder assez de santé, d’énergie et de ressources pour tenir jour après jour.',
        points: [
            { title: 'Surveille les stats', text: 'La faim, la soif, l’énergie, le moral, le stress et l’infection déterminent si tu tiens.' },
            { title: 'La nuit est critique', text: 'Le danger augmente vite si ton abri est faible, trop bruyant ou mal préparé.' },
            { title: 'Chaque décision compte', text: 'Les petites actions du quotidien sont souvent ce qui évite l’effondrement.' }
        ]
    },
    {
        title: '2. Le rythme d’une journée',
        text: 'Une journée est découpée en matin, après-midi, soir et nuit. Beaucoup d’actions font avancer le temps.',
        points: [
            { title: 'Actions de base', text: 'Manger, boire, dormir et se soigner servent à stabiliser la situation.' },
            { title: 'Actions avancées', text: 'Renforcer, patrouiller ou faire la garde permet de mieux préparer la suite.' },
            { title: 'Gestion du risque', text: 'Avancer le temps sans préparation peut t’exposer à une nuit difficile.' }
        ]
    },
    {
        title: '3. Explorer sans se faire tuer',
        text: 'Le loot vient surtout de l’exploration. Il faut doser le risque entre sorties sûres et expéditions rentables.',
        points: [
            { title: 'Sorties simples', text: 'Aucun coût direct, peu de risque, butin modéré. Idéal pour tenir les premiers jours.' },
            { title: 'Expéditions dangereuses', text: 'Demandent souvent munitions et carburant, mais offrent de meilleurs gains.' },
            { title: 'Abri, bruit, danger', text: 'Un abri faible, trop de bruit ou un danger extérieur élevé peuvent te rattraper très vite.' }
        ]
    },
    {
        title: '4. Les grands axes du jeu',
        text: 'La vraie progression vient du long terme : améliorer l’abri, sécuriser la production et débloquer les systèmes avancés.',
        points: [
            { title: 'Abri & électricité', text: 'Construis pour mieux produire, stocker l’énergie et rester stable.' },
            { title: 'Jour 15 : véhicules', text: 'Le garage améliore les expéditions et ouvre de meilleures récupérations.' },
            { title: 'Jour 30 : colonie', text: 'Tu passes d’une survie solo à une gestion de communauté. Tu peux aussi utiliser le bonus pub pour tenter de sécuriser une caisse de ravitaillement bonus.' }
        ]
    }
];

const rewardWheelSegments = [
    { id: 'ration_crate', label: '🍖 Rations', desc: '+4 nourriture, +2 eau', rewards: { food: 4, water: 2 }, weight: 22, rarity: 'courant' },
    { id: 'medical_case', label: '🩹 Médical', desc: '+2 bandages, +1 médicament', rewards: { bandage: 2, medicine: 1 }, weight: 15, rarity: 'courant' },
    { id: 'scrap_bundle', label: '🔩 Ferraille', desc: '+5 matériaux', rewards: { materials: 5 }, weight: 18, rarity: 'courant' },
    { id: 'ammo_cache', label: '🔫 Munitions', desc: '+4 munitions, +1 bandage', rewards: { ammo: 4, bandage: 1 }, weight: 12, rarity: 'rare' },
    { id: 'fuel_can', label: '⛽ Carburant', desc: '+3 carburant', rewards: { fuel: 3 }, weight: 10, rarity: 'rare' },
    { id: 'field_kit', label: '🎒 Kit terrain', desc: '+2 eau, +2 nourriture, +2 matériaux', rewards: { water: 2, food: 2, materials: 2 }, weight: 11, rarity: 'rare' },
    { id: 'convoy_drop', label: '📦 Convoi', desc: '+3 nourriture, +3 eau, +2 matériaux, +1 munition', rewards: { food: 3, water: 3, materials: 2, ammo: 1 }, weight: 7, rarity: 'épique' },
    { id: 'black_case', label: '☣️ Caisse noire', desc: '+1 médicament, +2 carburant, +3 munitions', rewards: { medicine: 1, fuel: 2, ammo: 3 }, weight: 5, rarity: 'épique' }
];

const rewardAdConfig = {
    enabled: true,
    testMode: true,
    androidAppId: 'ca-app-pub-2595724577989177~3048914982',
    androidRewardedId: 'ca-app-pub-2595724577989177/7057641867',
    iosRewardedId: 'ca-app-pub-3940256099942544/1712485313'
};

const rewardAdRuntime = {
    provider: 'Simulation',
    nativeAvailable: false,
    initialized: false,
    consentReady: false,
    lastError: ''
};

const colonyFoundingCost = { materials: 12, food: 8, water: 8, ammo: 2, fuel: 5 };

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
    { name: 'Eva Morel', age: 30, rarity: 'common', trait: 'Calme', role: 'rest', skills: { exploration: 4, defense: 4, medicine: 5, construction: 5, production: 5 } },
    { name: 'Alexis Moreau', age: 34, rarity: 'legendary', trait: 'Chef de guerre', role: 'rest', skills: { exploration: 10, defense: 10, medicine: 7, construction: 7, production: 10 } }
];

const simpleLocations = [
    {
        id: 'house',
        name: 'Maison abandonnée',
        risk: 26,
        loot: 'nourriture',
        desc: 'Placards vides mais parfois encore utiles.',
        rewards: { food: [0, 2], water: [0, 2], materials: [0, 2], bandage: [0, 1] }
    },
    {
        id: 'apartment',
        name: 'Appartement vide',
        risk: 30,
        loot: 'eau',
        desc: 'Peu de place, peu de bruit, peu de surprise.',
        rewards: { food: [1, 3], water: [1, 2], bandage: [0, 1] }
    },
    {
        id: 'garage',
        name: 'Garage local',
        risk: 34,
        loot: 'matériaux',
        desc: 'Ferraille, outils et bazar mécanique.',
        rewards: { materials: [1, 3], ammo: [0, 2], fuel: [1, 2] }
    },
    {
        id: 'shop',
        name: 'Petite supérette',
        risk: 38,
        loot: 'provisions',
        desc: 'Quelques rayons encore exploitables.',
        rewards: { food: [2, 3], water: [1, 3], materials: [0, 3], fuel: [0, 1] }
    }
];

const dangerousLocations = [
    {
        id: 'station',
        name: 'Station-service',
        risk: 64,
        loot: 'carburant',
        cost: { ammo: 2, fuel: 2 },
        desc: 'Exposée mais utile pour durer.',
        rewards: { fuel: [4, 6], water: [0, 2], materials: [2, 4] }
    },
    {
        id: 'warehouse',
        name: 'Entrepôt',
        risk: 70,
        loot: 'gros stock',
        cost: { ammo: 3 },
        desc: 'Grand espace, gros bruit, bonne rentabilité.',
        rewards: { food: [4, 6], materials: [4, 8], water: [2, 4] }
    },
    {
        id: 'hospital',
        name: 'Hôpital',
        risk: 74,
        loot: 'médical',
        cost: { ammo: 3, fuel: 3 },
        desc: 'Très riche mais infecté et instable.',
        rewards: { bandage: [3, 6], medicine: [2, 4], food: [0, 2], water: [0, 2] }
    },
    {
        id: 'police',
        name: 'Commissariat',
        risk: 78,
        loot: 'munitions',
        cost: { ammo: 3, fuel: 3 },
        desc: 'Zone tendue avec gros potentiel de loot.',
        rewards: { ammo: [4, 8], materials: [2, 5], bandage: [0, 2] }
    }
];

const buildingDefs = [
    { id: 'rainCollector', name: 'Récupérateur d’eau', desc: 'Produit de l’eau pendant la pluie.', cost: { materials: 4 } },
    { id: 'garden', name: 'Petit potager', desc: 'Produit de la nourriture tous les quelques jours.', cost: { materials: 5, water: 1 } },
    { id: 'medicalCorner', name: 'Coin médical', desc: 'Rend les soins plus efficaces.', cost: { materials: 4, medicine: 1 } },
    { id: 'bed', name: 'Lit amélioré', desc: 'Dormir récupère davantage d’énergie.', cost: { materials: 3, food: 1 } },
    { id: 'generator', name: 'Générateur', desc: 'Produit un courant stable quel que soit le temps, consomme du carburant et augmente fortement le bruit.', cost: { materials: 12, fuel: 6 } },
    { id: 'batteryBank', name: 'Batteries', desc: 'Stockent l’électricité pour la nuit et les périodes sans production.', cost: { materials: 10, fuel: 2 } },
    { id: 'solarPanels', name: 'Panneaux solaires tardifs', desc: 'Rechargent les batteries en journée. Production meilleure par temps clair et plus faible sous la pluie.', cost: { materials: 16, fuel: 2 } },
    { id: 'lighting', name: 'Éclairage', desc: 'Consomme de l’électricité mais améliore le moral et réduit les risques nocturnes dans l’abri.', cost: { materials: 6 } },
    { id: 'radio', name: 'Radio', desc: 'Consomme de l’électricité. Sera encore plus utile plus tard, mais aide déjà à capter des signaux utiles.', cost: { materials: 5 } }
];

const vehicleDefs = [
    {
        id: 'bike',
        rarity: 'common',
        name: 'Vélo rafistolé',
        desc: 'Silencieux, facile à remettre en état, mais très limité pour transporter du matériel.',
        searchText: 'Un vélo rafistolé est caché derrière un grillage. Peu impressionnant, mais utile pour de petites sorties.',
        noise: -2,
        cargo: 2,
        fuelUse: 0,
        riskMod: -3,
        bonusLoot: 1,
        dangerousBonusLoot: 1,
        upkeep: { materials: 1 },
        repairCost: { materials: 3 }
    },
    {
        id: 'scooter',
        rarity: 'common',
        name: 'Scooter usé',
        desc: 'Pratique en ville, peu coûteux, mais dépend d’un peu de carburant et reste fragile.',
        searchText: 'Tu repères un scooter usé dans une cour. Avec quelques pièces, il pourrait repartir.',
        noise: 2,
        cargo: 3,
        fuelUse: 1,
        riskMod: -1,
        bonusLoot: 2,
        dangerousBonusLoot: 2,
        upkeep: { fuel: 1, materials: 1 },
        repairCost: { materials: 4, fuel: 1 }
    },
    {
        id: 'motorbike',
        rarity: 'rare',
        name: 'Moto de fuite',
        desc: 'Rapide et nerveuse. Moins discrète qu’un vélo, mais très utile pour rentrer vivant.',
        searchText: 'Une moto de fuite dort sous une bâche. Elle n’attend qu’un peu d’essence et de mécanique.',
        noise: 4,
        cargo: 4,
        fuelUse: 1,
        riskMod: -4,
        bonusLoot: 2,
        dangerousBonusLoot: 3,
        upkeep: { fuel: 1, materials: 1 },
        repairCost: { materials: 5, fuel: 2 }
    },
    {
        id: 'compact',
        rarity: 'rare',
        name: 'Voiture compacte',
        desc: 'Bonne option polyvalente. Transporte correctement sans attirer autant l’attention qu’un gros moteur.',
        searchText: 'Une petite voiture encore entière est bloquée entre deux carcasses. Elle semble récupérable.',
        noise: 5,
        cargo: 6,
        fuelUse: 2,
        riskMod: -2,
        bonusLoot: 3,
        dangerousBonusLoot: 4,
        upkeep: { fuel: 1, materials: 1 },
        repairCost: { materials: 7, fuel: 3 }
    },
    {
        id: 'pickup',
        rarity: 'elite',
        name: 'Pick-up fatigué',
        desc: 'Idéal pour charger du lourd, mais son moteur usé consomme et attire l’attention.',
        searchText: 'Tu tombes sur un pick-up fatigué. Gros potentiel, gros entretien.',
        noise: 8,
        cargo: 9,
        fuelUse: 3,
        riskMod: 1,
        bonusLoot: 4,
        dangerousBonusLoot: 6,
        upkeep: { fuel: 2, materials: 2 },
        repairCost: { materials: 10, fuel: 4 }
    },
    {
        id: 'van',
        rarity: 'legendary',
        name: 'Fourgon de ravitaillement',
        desc: 'Le rêve logistique du groupe : grosse charge utile, mais cher à remettre en route et bruyant.',
        searchText: 'Un ancien fourgon de ravitaillement est encore là. C’est une trouvaille rare, mais coûteuse.',
        noise: 10,
        cargo: 12,
        fuelUse: 4,
        riskMod: 2,
        bonusLoot: 5,
        dangerousBonusLoot: 8,
        upkeep: { fuel: 2, materials: 2 },
        repairCost: { materials: 12, fuel: 5 }
    }
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
                    const loot = giveRandomLoot(s, 1, 1);

                    addLog(
                        'Placard oublié',
                        `Tu trouves ${loot.text} coincé derrière une boîte vide.`,
                        'Événement'
                    );

                    toast(
                        'Petit gain',
                        `+${loot.text}.`,
                        'success'
                    );
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
                    const loot = giveRandomLoot(s, 1, 2);
                    s.stats.health = clamp(s.stats.health - 4);
                    s.stats.infection = clamp(s.stats.infection + 8);

                    addLog(
                        'Coupure sale',
                        `La blessure est légère, mais l’infection monte. Malgré ça, tu récupères ${loot.text}.`,
                        'Danger'
                    );

                    toast(
                        'Blessure et loot',
                        `Infection +8, Santé -4, +${loot.text}.`,
                        'danger'
                    );
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

                    const loot = giveRandomLoot(s, 1, 2);

                    addLog(
                        'Air contaminé',
                        `Tu insistes malgré l’air toxique et récupères ${loot.text}.`,
                        'Danger'
                    );

                    toast(
                        'Air contaminé',
                        `Infection +12, +${loot.text}.`,
                        'danger'
                    );
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

                    const loot = giveRandomLoot(s, 2, 3);

                    addLog(
                        'Salle infestée',
                        `Tu forces le passage et ressors avec ${loot.text}.`,
                        'Danger'
                    );

                    toast(
                        'Sortie brutale',
                        `Santé -6, infection +10, +${loot.text}.`,
                        'danger'
                    );
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
        tutorialSeen: false,
        rewardAds: {
            lastClaimDay: 0,
            totalClaims: 0
        },
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
            bed: { built: false },
            generator: { built: false },
            batteryBank: { built: false },
            solarPanels: { built: false },
            lighting: { built: false },
            radio: { built: false }
        },
        power: {
            stored: 0,
            capacity: 0,
            generatorOn: false,
            lightingOn: false,
            radioOn: false,
            lastSource: 'Aucun'
        },
        vehicle: {
            unlockDay: 15,
            garage: [],
            activeId: null,
            pendingFound: null,
            searchCooldown: 0,
            lastSearchDay: null
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
        merchant: {
            active: false,
            nextVisitDay: randomInt(5, 7),
            leaveDay: null,
            market: {},
            lastVisitDay: null,
            profile: 'honest'
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
const tutorialMenuBtn = $('tutorialMenuBtn');
const resetSaveBtn = $('resetSaveBtn');
const saveNowBtn = $('saveNowBtn');
const stickyActions = $('stickyActions');
const stickyActionsSpacer = $('stickyActionsSpacer');

const buildingsToggle = $('buildingsToggle');
const inventoryToggle = $('inventoryToggle');
const statsToggle = $('statsToggle');
const overviewToggle = $('overviewToggle');
const simpleToggle = $('simpleToggle');
const dangerousToggle = $('dangerousToggle');
const journalToggle = $('journalToggle');
const colonyToggle = $('colonyToggle');
const merchantToggle = $('merchantToggle');
const vehicleToggle = $('vehicleToggle');

const buildingsContent = $('buildingsContent');
const inventoryContent = $('inventoryContent');
const statsContent = $('statsContent');
const overviewContent = $('overviewContent');
const simpleContent = $('simpleContent');
const dangerousContent = $('dangerousContent');
const journalContent = $('journalContent');
const colonyContent = $('colonyContent');
const merchantContent = $('merchantContent');
const vehicleContent = $('vehicleContent');

const moreActionsBtn = $('moreActionsBtn');
const moreActionsPanel = $('moreActionsPanel');
const stickyActionsBackdrop = $('stickyActionsBackdrop');
const closeMoreActionsBtn = $('closeMoreActionsBtn');

const stickyVitals = $('stickyVitals');
const stickyResources = $('stickyResources');
const statusSummary = $('statusSummary');
const statsGrid = $('statsGrid');
const statusChips = $('statusChips');
const overviewGrid = $('overviewGrid');
const inventoryList = $('inventoryList');
const merchantPanel = $('merchantPanel');
const merchantStatusLabel = $('merchantStatusLabel');
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
const rewardAdStatus = $('rewardAdStatus');
const rewardAdPanel = $('rewardAdPanel');
const rewardQuickAccess = $('rewardQuickAccess');
const colonyPanel = $('colonyPanel');
const colonyHeadText = $('colonyHeadText');
const colonyPhaseBadge = $('colonyPhaseBadge');
const vehiclePanel = $('vehiclePanel');
const vehicleHeadText = $('vehicleHeadText');
const gameOverScreen = $('gameOverScreen');
const gameOverReason = $('gameOverReason');
const gameOverStats = $('gameOverStats');
const restartBtn = $('restartBtn');
const backMenuBtn = $('backMenuBtn');
const eventModal = $('eventModal');
const eventTitle = $('eventTitle');
const eventText = $('eventText');
const eventChoices = $('eventChoices');
const tutorialModal = $('tutorialModal');
const tutorialProgress = $('tutorialProgress');
const tutorialTitle = $('tutorialTitle');
const tutorialText = $('tutorialText');
const tutorialPoints = $('tutorialPoints');
const tutorialPrevBtn = $('tutorialPrevBtn');
const tutorialNextBtn = $('tutorialNextBtn');
const tutorialSkipBtn = $('tutorialSkipBtn');
const rewardAdModal = $('rewardAdModal');
const rewardAdStage = $('rewardAdStage');
const rewardWheelStage = $('rewardWheelStage');
const rewardAdText = $('rewardAdText');
const rewardAdCountdown = $('rewardAdCountdown');
const rewardAdWatchBtn = $('rewardAdWatchBtn');
const rewardAdCloseBtn = $('rewardAdCloseBtn');
const rewardWheel = $('rewardWheel');
const rewardWheelLabels = $('rewardWheelLabels');
const rewardSpinBtn = $('rewardSpinBtn');
const rewardClaimBtn = $('rewardClaimBtn');
const rewardSpinResult = $('rewardSpinResult');
const rewardWheelText = $('rewardWheelText');
const rewardAdModeBadge = $('rewardAdModeBadge');
const rewardToggle = $('rewardToggle');
const rewardContent = $('rewardContent');
const rewardAdProviderBadge = $('rewardAdProviderBadge');
const rewardAdProviderText = $('rewardAdProviderText');

document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
        handleAction(btn.dataset.action);

        if (moreActionsPanel && moreActionsPanel.contains(btn)) {
            setMoreActionsOpen(false);
        }
    });
});

if (continueBtn) continueBtn.addEventListener('click', continueGame);
if (newGameBtn) newGameBtn.addEventListener('click', startNewGame);
if (resetSaveBtn) resetSaveBtn.addEventListener('click', resetSave);
if (saveNowBtn) {
    saveNowBtn.addEventListener('click', () => {
        save();
        toast('Sauvegarde', 'Partie sauvegardée.', 'success');
    });
}

if (tutorialMenuBtn) tutorialMenuBtn.addEventListener('click', () => openTutorial(false));
if (tutorialPrevBtn) tutorialPrevBtn.addEventListener('click', () => changeTutorialStep(-1));
if (tutorialNextBtn) tutorialNextBtn.addEventListener('click', () => changeTutorialStep(1));
if (tutorialSkipBtn) tutorialSkipBtn.addEventListener('click', () => closeTutorial(true));
if (rewardAdWatchBtn) rewardAdWatchBtn.addEventListener('click', startRewardAd);
if (rewardAdCloseBtn) rewardAdCloseBtn.addEventListener('click', closeRewardAdModal);
if (rewardSpinBtn) rewardSpinBtn.addEventListener('click', spinRewardWheel);
if (rewardClaimBtn) rewardClaimBtn.addEventListener('click', claimRewardWheelPrize);
if (rewardAdPanel) {
    rewardAdPanel.addEventListener('click', e => {
        const btn = e.target.closest('[data-open-reward-ad]');
        if (!btn) return;
        void openRewardAdModal();
    });
}
if (rewardQuickAccess) {
    rewardQuickAccess.addEventListener('click', e => {
        const btn = e.target.closest('[data-open-reward-section], [data-open-reward-ad]');
        if (!btn) return;
        if (btn.hasAttribute('data-open-reward-ad')) {
            void openRewardAdModal();
            return;
        }
        openRewardSupplySection();
    });
}

if (restartBtn && gameOverScreen) {
    restartBtn.addEventListener('click', () => {
        gameOverScreen.classList.add('hidden');
        startNewGame();
    });
}

if (backMenuBtn && gameOverScreen) {
    backMenuBtn.addEventListener('click', () => {
        gameOverScreen.classList.add('hidden');
        toggleGame(false);
    });
}

let tutorialStepIndex = 0;
let rewardAdTimer = null;
let pendingWheelReward = null;
let rewardSpinLocked = false;

function setMoreActionsOpen(open) {
    if (!moreActionsPanel || !stickyActionsBackdrop || !moreActionsBtn) return;

    moreActionsPanel.classList.toggle('hidden', !open);
    stickyActionsBackdrop.classList.toggle('hidden', !open);
    moreActionsBtn.setAttribute('aria-expanded', String(open));

    moreActionsBtn.innerHTML = open
        ? `
            <span class="action-more-toggle__icon">−</span>
            <span class="action-more-toggle__copy">
              <strong>Moins</strong>
              <small>Fermer</small>
            </span>
          `
        : `
            <span class="action-more-toggle__icon">＋</span>
            <span class="action-more-toggle__copy">
              <strong>Plus</strong>
              <small>Actions</small>
            </span>
          `;

    document.body.classList.toggle('drawer-open', open);
    syncStickySpacer();
}

if (moreActionsBtn && moreActionsPanel) {
    moreActionsBtn.addEventListener('click', () => {
        const willOpen = moreActionsPanel.classList.contains('hidden');
        setMoreActionsOpen(willOpen);
    });
}

if (stickyActionsBackdrop) {
    stickyActionsBackdrop.addEventListener('click', () => setMoreActionsOpen(false));
}

if (closeMoreActionsBtn) {
    closeMoreActionsBtn.addEventListener('click', () => setMoreActionsOpen(false));
}

if (buildingsToggle && buildingsContent) buildingsToggle.addEventListener('click', () => toggleAccordion(buildingsToggle, buildingsContent));
if (inventoryToggle && inventoryContent) inventoryToggle.addEventListener('click', () => toggleAccordion(inventoryToggle, inventoryContent));
if (statsToggle && statsContent) statsToggle.addEventListener('click', () => toggleAccordion(statsToggle, statsContent));
if (overviewToggle && overviewContent) overviewToggle.addEventListener('click', () => toggleAccordion(overviewToggle, overviewContent));
if (simpleToggle && simpleContent) simpleToggle.addEventListener('click', () => toggleAccordion(simpleToggle, simpleContent));
if (dangerousToggle && dangerousContent) dangerousToggle.addEventListener('click', () => toggleAccordion(dangerousToggle, dangerousContent));
if (journalToggle && journalContent) journalToggle.addEventListener('click', () => toggleAccordion(journalToggle, journalContent));
if (colonyToggle && colonyContent) colonyToggle.addEventListener('click', () => toggleAccordion(colonyToggle, colonyContent));
if (merchantToggle && merchantContent) merchantToggle.addEventListener('click', () => toggleAccordion(merchantToggle, merchantContent));
if (vehicleToggle && vehicleContent) vehicleToggle.addEventListener('click', () => toggleAccordion(vehicleToggle, vehicleContent));
if (rewardToggle && rewardContent) rewardToggle.addEventListener('click', () => toggleAccordion(rewardToggle, rewardContent));

window.addEventListener('resize', syncStickySpacer);

function toggleAccordion(trigger, content) {
    const open = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', String(!open));
    content.classList.toggle('hidden', open);
}

function openRewardSupplySection() {
    if (rewardToggle && rewardContent && rewardToggle.getAttribute('aria-expanded') !== 'true') {
        toggleAccordion(rewardToggle, rewardContent);
    }
    const panel = rewardToggle?.closest('.bonus-panel') || rewardQuickAccess;
    panel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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


function formatResourceAmount(resource, amount) {
    if (resource === 'ammo') return `${amount} munition${amount > 1 ? 's' : ''}`;
    if (resource === 'materials') return amount > 1 ? `${amount} matériaux` : '1 matériau';
    if (resource === 'food') return `${amount} ration${amount > 1 ? 's' : ''}`;
    if (resource === 'water') return `${amount} eau`;
    if (resource === 'medicine') return `${amount} médicament${amount > 1 ? 's' : ''}`;
    if (resource === 'bandage') return `${amount} bandage${amount > 1 ? 's' : ''}`;
    if (resource === 'fuel') return `${amount} carburant`;
    return `${amount} ${resourceLabels[resource] || resource}`;
}

function giveRandomLoot(targetState, min = 1, max = 1, allowedResources = lootableResources) {
    const resource = pick(allowedResources);
    const amount = randomInt(min, max);

    targetState.inventory[resource] = (targetState.inventory[resource] || 0) + amount;
    targetState.statsSummary.resourcesFound += amount;

    return {
        resource,
        amount,
        label: resourceLabels[resource] || resource,
        text: formatResourceAmount(resource, amount),
        icon: icons[resource] || '📦'
    };
}

function save() {
    state.lastSavedAt = new Date().toISOString();
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    renderSaveLabel();
    if (continueBtn) continueBtn.disabled = false;
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

    const rawInventory = raw?.inventory || {};
    const rawStats = raw?.stats || {};
    const rawStatsSummary = raw?.statsSummary || {};
    const rawBuildings = raw?.buildings || {};
    const rawMerchant = raw?.merchant || {};
    const rawPower = raw?.power || {};
    const rawVehicle = raw?.vehicle || {};
    const rawColony = raw?.colony || {};
    const rawColonyUpgrades = rawColony.upgrades || {};
    const rawColonists = rawColony.colonists || [];
    const rawRewardAds = raw?.rewardAds || {};

    const legacyCurrent = rawVehicle['current'] || null;
    const legacyFound = !!rawVehicle['found'];
    const legacyType = rawVehicle['type'] || null;
    const legacyStorageBonus = rawVehicle['storageBonus'] || 0;
    const legacyFuelUse = rawVehicle['fuelUse'] || 0;
    const legacyDurability = rawVehicle['durability'] || 40;
    const legacyRepaired = !!rawVehicle['repaired'];

    next.inventory = { ...base.inventory, ...rawInventory };
    next.stats = { ...base.stats, ...rawStats };
    next.statsSummary = { ...base.statsSummary, ...rawStatsSummary };
    next.buildings = { ...base.buildings, ...rawBuildings };
    next.merchant = { ...base.merchant, ...rawMerchant };
    next.power = { ...base.power, ...rawPower };
    next.vehicle = { ...base.vehicle, ...rawVehicle };
    next.rewardAds = { ...base.rewardAds, ...rawRewardAds };
    next.tutorialSeen = typeof raw?.tutorialSeen === 'boolean' ? raw.tutorialSeen : base.tutorialSeen;

    next.vehicle.garage = Array.isArray(rawVehicle.garage)
        ? rawVehicle.garage.map((vehicle, index) => ({
            ...vehicle,
            uid: vehicle.uid || `veh_restore_${index}_${Date.now()}`,
            condition: typeof vehicle.condition === 'number' ? vehicle.condition : randomInt(24, 58),
            repaired: !!vehicle.repaired,
            operational: !!vehicle.operational
        }))
        : [];

    next.vehicle.pendingFound = rawVehicle.pendingFound
        ? {
            ...rawVehicle.pendingFound,
            uid: rawVehicle.pendingFound.uid || `veh_pending_${Date.now()}`,
            condition: typeof rawVehicle.pendingFound.condition === 'number'
                ? rawVehicle.pendingFound.condition
                : randomInt(24, 58),
            repaired: !!rawVehicle.pendingFound.repaired,
            operational: !!rawVehicle.pendingFound.operational
        }
        : null;

    if (legacyCurrent && !next.vehicle.garage.length) {
        next.vehicle.garage.push({
            ...legacyCurrent,
            uid: legacyCurrent.uid || `veh_legacy_${Date.now()}`,
            condition: typeof legacyCurrent.condition === 'number'
                ? legacyCurrent.condition
                : randomInt(24, 58),
            repaired: !!legacyCurrent.repaired,
            operational: !!legacyCurrent.operational
        });
        next.vehicle.activeId = next.vehicle.garage[0].uid;
    }

    if (!next.vehicle.garage.length && legacyFound && legacyType) {
        next.vehicle.garage.push({
            id: 'legacy',
            uid: `veh_legacy_${Date.now()}`,
            rarity: 'rare',
            name: legacyType,
            desc: 'Véhicule issu d’une ancienne sauvegarde.',
            searchText: '',
            noise: 5,
            cargo: legacyStorageBonus || 4,
            fuelUse: legacyFuelUse || 2,
            riskMod: 0,
            bonusLoot: Math.max(1, Math.floor((legacyStorageBonus || 4) / 2)),
            dangerousBonusLoot: Math.max(2, legacyStorageBonus || 4),
            upkeep: { fuel: Math.max(0, legacyFuelUse || 2) },
            repairCost: { materials: 8, fuel: 4 },
            condition: legacyDurability,
            repaired: legacyRepaired,
            operational: legacyRepaired
        });
        next.vehicle.activeId = next.vehicle.garage[0].uid;
    }

    next.vehicle.searchCooldown =
        typeof next.vehicle.searchCooldown === 'number' ? next.vehicle.searchCooldown : 0;

    next.colony = { ...base.colony, ...rawColony };
    next.colony.upgrades = { ...base.colony.upgrades, ...rawColonyUpgrades };
    next.colony.colonists = rawColonists.map((colonist, index) => ({
        id: colonist.id || `colon_restore_${index}`,
        name: colonist.name || `Colon ${index + 1}`,
        age: colonist.age || randomInt(24, 46),
        rarity: colonist.rarity || 'common',
        trait: colonist.trait || 'Survivant',
        role: colonist.role || 'rest',
        status: colonist.status || 'idle',
        health: typeof colonist.health === 'number' ? colonist.health : randomInt(70, 92),
        morale: typeof colonist.morale === 'number' ? colonist.morale : randomInt(55, 78),
        fatigue: typeof colonist.fatigue === 'number' ? colonist.fatigue : randomInt(8, 28),
        skills: {
            exploration: 4,
            defense: 4,
            medicine: 4,
            construction: 4,
            production: 4,
            ...(colonist.skills || {})
        },
        consumption: {
            food: 2,
            water: 1,
            medicine: 0,
            ...(colonist.consumption || {})
        }
    }));

    updateColonyDerivedStats(next);

    return next;
}


function getMerchantProfile() {
    return merchantProfiles[state.merchant.profile] || merchantProfiles.honest;
}

function generateMerchantProfile() {
    const roll = Math.random();
    if (roll < 0.28) return 'honest';
    if (roll < 0.56) return 'opportunist';
    if (roll < 0.78) return 'doctor';
    return 'arms';
}

function generateMerchantMarket() {
    const profile = merchantProfiles[state.merchant.profile] || merchantProfiles.honest;
    return lootableResources.reduce((acc, resource) => {
        const profileBias = profile.marketBias?.[resource] || 1;
        acc[resource] = Number(((0.8 + Math.random() * 0.6) * profileBias).toFixed(2));
        return acc;
    }, {});
}

function getMerchantWeatherFactor(resource) {
    if (state.weather === 'rain' && resource === 'water') return 0.9;
    if (state.weather === 'cold' && resource === 'food') return 1.15;
    if (state.weather === 'fog' && resource === 'ammo') return 1.1;
    return 1;
}

function getMerchantBuyPrice(resource) {
    const stock = state.inventory[resource] || 0;
    const base = merchantBaseValues[resource] || 1;
    const marketFactor = state.merchant.market?.[resource] || 1;
    const profileFactor = getMerchantProfile().buyFactor || 1;
    const scarcityFactor = stock <= 1 ? 1.35 : stock <= 3 ? 1.18 : stock >= 10 ? 0.88 : 1;
    return Math.max(1, Math.round(base * marketFactor * scarcityFactor * profileFactor * getMerchantWeatherFactor(resource)));
}

function getMerchantSellPrice(resource) {
    const stock = state.inventory[resource] || 0;
    const base = merchantBaseValues[resource] || 1;
    const marketFactor = state.merchant.market?.[resource] || 1;
    const profileFactor = getMerchantProfile().sellFactor || 1;
    const abundanceFactor = stock >= 10 ? 1.1 : stock >= 6 ? 1.04 : stock <= 1 ? 0.84 : 0.94;
    return Math.max(1, Math.round(base * marketFactor * abundanceFactor * profileFactor));
}

function getMerchantTradeQuote(giveResource, receiveResource) {
    if (!giveResource || !receiveResource || giveResource === receiveResource) return null;
    const giveValue = getMerchantSellPrice(giveResource);
    const receiveValue = getMerchantBuyPrice(receiveResource);
    const cost = Math.max(1, Math.ceil(receiveValue / giveValue));
    return { cost, receiveAmount: 1 };
}

function getMerchantMoodLabel(resource) {
    const factor = state.merchant.market?.[resource] || 1;
    if (factor >= 1.25) return 'Très recherché';
    if (factor >= 1.08) return 'Demandé';
    if (factor <= 0.88) return 'Offre abondante';
    return 'Stable';
}

function updateMerchantForNewDay() {
    if (state.merchant.active && state.merchant.leaveDay !== null && state.day > state.merchant.leaveDay) {
        state.merchant.active = false;
        state.merchant.market = {};
        state.merchant.lastVisitDay = state.day - 1;
        state.merchant.leaveDay = null;
        state.merchant.nextVisitDay = state.day + randomInt(5, 7);
        addLog('Marchand parti', 'Le marchand itinérant a quitté la zone avant l’aube.', 'Commerce');
    }

    if (!state.merchant.active && state.day >= state.merchant.nextVisitDay) {
        state.merchant.active = true;
        state.merchant.leaveDay = state.day;
        state.merchant.profile = generateMerchantProfile();
        state.merchant.market = generateMerchantMarket();
        state.merchant.lastVisitDay = state.day;
        addLog('Marchand en vue', `${getMerchantProfile().name} s’installe près de l’abri pour la journée.`, 'Commerce');
        toast('Marchand', 'Un marchand est disponible aujourd’hui.', 'info');
    }
}

function makeMerchantTrade(giveResource, receiveResource) {
    const quote = getMerchantTradeQuote(giveResource, receiveResource);

    if (!state.merchant.active) {
        toast('Commerce indisponible', 'Aucun marchand n’est disponible pour le moment.', 'warning');
        return;
    }

    if (!quote) {
        toast('Échange invalide', 'Choisis deux ressources différentes.', 'warning');
        return;
    }

    if ((state.inventory[giveResource] || 0) < quote.cost) {
        toast('Ressources insuffisantes', `Il faut ${quote.cost} ${resourceLabels[giveResource]} pour cet échange.`, 'warning');
        return;
    }

    state.inventory[giveResource] -= quote.cost;
    state.inventory[receiveResource] = (state.inventory[receiveResource] || 0) + quote.receiveAmount;

    addLog(
        'Échange marchand',
        `Tu échanges ${quote.cost} ${resourceLabels[giveResource]} contre ${quote.receiveAmount} ${resourceLabels[receiveResource]}.`,
        'Commerce'
    );

    toast(
        'Échange validé',
        `-${quote.cost} ${resourceLabels[giveResource]} • +${quote.receiveAmount} ${resourceLabels[receiveResource]}.`,
        'success'
    );

    save();
    render();
}

function getActionMeta(action) {
    const map = {
        sleep: { icon: '🌙', title: 'Dormir', desc: 'Passe le temps. Remonte surtout l’énergie et baisse le stress.', cost: 'Temps', risk: 'Faible' },
        eat: { icon: '🍖', title: 'Manger', desc: 'Consomme 1 nourriture. Remonte la faim.', cost: '1 nourriture', risk: 'Aucun' },
        drink: { icon: '💧', title: 'Boire', desc: 'Consomme 1 eau. Remonte la soif.', cost: '1 eau', risk: 'Aucun' },
        heal: { icon: '🩹', title: 'Soigner', desc: 'Consomme 1 bandage. Remonte la santé et baisse l’infection.', cost: '1 bandage', risk: 'Aucun' },
        relax: { icon: '🫁', title: 'Se détendre', desc: 'Passe le temps. Réduit fortement le stress et remonte le moral.', cost: 'Temps', risk: 'Faible' },
        fortify: { icon: '🧱', title: 'Renforcer', desc: 'Améliore la protection de l’abri mais fatigue.', cost: '2 matériaux + temps', risk: 'Faible' },
        'night-watch': { icon: '👁️', title: 'Garde', desc: 'Réduit le risque nocturne, mais augmente la fatigue et le stress.', cost: 'Temps + énergie', risk: 'Moyen' },
        patrol: { icon: '🚶', title: 'Patrouiller', desc: 'Réduit le danger extérieur, mais consomme de l’énergie.', cost: 'Temps + énergie', risk: 'Moyen' },
        'secure-zone': { icon: '🛡️', title: 'Sécuriser', desc: 'Réduit le danger et améliore l’abri.', cost: '3 matériaux + temps', risk: 'Faible' },
        'clear-threat': { icon: '🔫', title: 'Éliminer', desc: 'Réduit fortement le danger, mais fait du bruit et consomme des munitions.', cost: '2 munitions + temps', risk: 'Élevé' },
        next: { icon: '⏱️', title: 'Passer le temps', desc: 'Laisse filer quelques heures sans autre effet direct.', cost: 'Temps', risk: 'Variable' }
    };
    return map[action] || { icon: '•', title: action, desc: '', cost: '', risk: '' };
}

function renderActionLabels() {
    document.querySelectorAll('[data-action]').forEach(btn => {
        const action = btn.dataset.action;
        const meta = getActionMeta(action);
        const riskClass = meta.risk === 'Élevé' ? 'danger' : meta.risk === 'Moyen' ? 'warning' : 'safe';
        btn.innerHTML = `
            <div class="action-pill-main">
                <span class="action-emoji">${meta.icon}</span>
                <div class="action-copy">
                    <strong>${meta.title}</strong>
                    <small>${meta.desc}</small>
                </div>
            </div>
            <div class="action-meta-row">
                <span class="action-mini-tag">Coût : ${meta.cost}</span>
                <span class="action-mini-tag ${riskClass}">Risque : ${meta.risk}</span>
            </div>
        `;
        btn.title = `${meta.title} — ${meta.desc} Coût : ${meta.cost}. Risque : ${meta.risk}.`;
    });
}

function toggleGame(show) {
    startScreen.classList.toggle('hidden', show);
    gameApp.classList.toggle('hidden', !show);
    stickyActions.classList.toggle('hidden', !show);
}

function changeTutorialStep(delta) {
    const nextIndex = tutorialStepIndex + delta;
    if (nextIndex < 0) return;
    if (nextIndex >= tutorialSlides.length) {
        closeTutorial(true);
        return;
    }
    tutorialStepIndex = nextIndex;
    renderTutorial();
}

function renderTutorial() {
    const slide = tutorialSlides[tutorialStepIndex];
    tutorialProgress.textContent = `Étape ${tutorialStepIndex + 1} / ${tutorialSlides.length}`;
    tutorialTitle.textContent = slide.title;
    tutorialText.textContent = slide.text;
    tutorialPoints.innerHTML = slide.points.map(point => `
      <article class="tutorial-point">
        <strong>${point.title}</strong>
        <span>${point.text}</span>
      </article>
    `).join('');

    tutorialPrevBtn.disabled = tutorialStepIndex === 0;
    const isLast = tutorialStepIndex === tutorialSlides.length - 1;
    tutorialNextBtn.innerHTML = isLast
        ? '<strong>Commencer</strong><span>Fermer le tutoriel et jouer</span>'
        : '<strong>Suivant</strong><span>Voir l’étape suivante</span>';
}

function openTutorial(markSeenOnClose = true) {
    tutorialStepIndex = 0;
    tutorialModal.dataset.markSeen = markSeenOnClose ? 'true' : 'false';
    tutorialModal.classList.remove('hidden');
    renderTutorial();
}

function closeTutorial(markSeen = false) {
    tutorialModal.classList.add('hidden');
    const shouldMarkSeen = tutorialModal.dataset.markSeen === 'true' || markSeen;
    if (shouldMarkSeen && !state.tutorialSeen) {
        state.tutorialSeen = true;
        save();
        render();
    }
}

function canUseRewardAd() {
    return state.rewardAds.lastClaimDay !== state.day;
}

function formatRewardsMap(rewards) {
    return Object.entries(rewards).map(([resource, amount]) => `${amount} ${resourceLabels[resource] || resource}`).join(', ');
}

function clearRewardAdTimer() {
    if (rewardAdTimer) {
        clearInterval(rewardAdTimer);
        rewardAdTimer = null;
    }
}

function getCapacitorPlatform() {
    return window.Capacitor?.getPlatform?.() || 'web';
}

function getAdMobPlugin() {
    return window.Capacitor?.Plugins?.AdMob || window.Capacitor?.Plugins?.admob || null;
}

function getRewardedAdUnitId() {
    const platform = getCapacitorPlatform();
    if (platform === 'android') return rewardAdConfig.androidRewardedId;
    if (platform === 'ios') return rewardAdConfig.iosRewardedId;
    return '';
}

async function initRewardedAds() {
    if (rewardAdRuntime.initialized) return rewardAdRuntime;

    const plugin = getAdMobPlugin();
    const platform = getCapacitorPlatform();
    if (!rewardAdConfig.enabled || !plugin || platform === 'web') {
        rewardAdRuntime.provider = 'Simulation';
        rewardAdRuntime.nativeAvailable = false;
        rewardAdRuntime.initialized = true;
        return rewardAdRuntime;
    }

    try {
        await plugin.initialize?.();

        if (plugin.requestConsentInfo) {
            let consentInfo = await plugin.requestConsentInfo();
            if (consentInfo && consentInfo.canRequestAds === false && plugin.showConsentForm) {
                consentInfo = await plugin.showConsentForm();
            }
            rewardAdRuntime.consentReady = consentInfo?.canRequestAds !== false;
        } else {
            rewardAdRuntime.consentReady = true;
        }

        rewardAdRuntime.provider = rewardAdConfig.testMode ? 'AdMob test' : 'AdMob live';
        rewardAdRuntime.nativeAvailable = true;
        rewardAdRuntime.initialized = true;
        rewardAdRuntime.lastError = '';
    } catch (error) {
        console.warn('AdMob init failed, fallback to simulation.', error);
        rewardAdRuntime.provider = 'Simulation';
        rewardAdRuntime.nativeAvailable = false;
        rewardAdRuntime.initialized = true;
        rewardAdRuntime.lastError = String(error?.message || error || 'Erreur inconnue');
    }

    return rewardAdRuntime;
}

function getRewardProviderLine() {
    if (rewardAdRuntime.nativeAvailable) {
        return rewardAdConfig.testMode
            ? 'AdMob actif en mode test sur APK Capacitor.'
            : 'AdMob actif avec unité récompensée.';
    }
    return 'Mode navigateur : séquence récompensée simulée.';
}

function renderRewardWheel() {
    if (!rewardWheel || !rewardWheelLabels) return;
    rewardWheel.classList.remove('opening', 'opened');
    rewardWheelLabels.innerHTML = rewardWheelSegments.map(segment => `
      <article class="reward-wheel-item">
        <strong>${segment.label}</strong>
        <small>${segment.desc}</small>
        <em>${segment.rarity}</em>
      </article>
    `).join('');
}

function resetRewardModalUi() {
    pendingWheelReward = null;
    rewardSpinLocked = false;

    if (rewardAdWatchBtn) rewardAdWatchBtn.disabled = false;
    if (rewardAdCloseBtn) rewardAdCloseBtn.disabled = false;
    if (rewardSpinBtn) rewardSpinBtn.disabled = false;
    if (rewardClaimBtn) rewardClaimBtn.classList.add('hidden');
    if (rewardSpinBtn) rewardSpinBtn.classList.remove('hidden');

    if (rewardSpinResult) {
        rewardSpinResult.className = 'reward-result locked';
        rewardSpinResult.textContent = 'Aucune caisse ouverte pour le moment.';
    }

    if (rewardAdCountdown) rewardAdCountdown.textContent = 'Prêt';
    if (rewardAdText) {
        rewardAdText.textContent = 'Regarde la pub récompensée pour sécuriser une caisse de ravitaillement abandonnée. Une seule tentative par jour de survie.';
    }
    if (rewardWheelText) {
        rewardWheelText.textContent = 'La diffusion est validée. Ouvre la caisse et récupère un lot de survie.';
    }
    if (rewardAdProviderText) {
        rewardAdProviderText.textContent = getRewardProviderLine();
    }
    if (rewardAdProviderBadge) {
        rewardAdProviderBadge.textContent = rewardAdRuntime.provider.toUpperCase();
    }

    renderRewardWheel();
}

async function openRewardAdModal() {
    if (!canUseRewardAd()) {
        toast('Bonus déjà pris', 'La caisse bonus a déjà été récupérée aujourd’hui.', 'warning');
        return;
    }

    if (!rewardAdModal.classList.contains('hidden')) return;
    if (!moreActionsPanel.classList.contains('hidden')) setMoreActionsOpen(false);

    await initRewardedAds();
    clearRewardAdTimer();
    rewardAdModal.classList.remove('hidden');
    rewardAdStage.classList.remove('hidden');
    rewardWheelStage.classList.add('hidden');
    resetRewardModalUi();
}

function closeRewardAdModal() {
    clearRewardAdTimer();
    rewardAdModal.classList.add('hidden');
}

function unlockLootCrate() {
    clearRewardAdTimer();
    if (rewardAdCountdown) rewardAdCountdown.textContent = 'Validé';
    if (rewardAdStage) rewardAdStage.classList.add('hidden');
    if (rewardWheelStage) rewardWheelStage.classList.remove('hidden');
    if (rewardSpinResult) {
        rewardSpinResult.className = 'reward-result locked';
        rewardSpinResult.textContent = 'Transmission validée. La caisse peut être ouverte.';
    }
}

function startRewardAdSimulation() {
    let remaining = 5;

    if (rewardAdCountdown) rewardAdCountdown.textContent = `${remaining}s`;
    if (rewardAdText) {
        rewardAdText.textContent = 'Diffusion simulée en cours... reste jusqu’au bout pour sécuriser la caisse.';
    }

    rewardAdTimer = setInterval(() => {
        remaining -= 1;

        if (remaining > 0) {
            if (rewardAdCountdown) rewardAdCountdown.textContent = `${remaining}s`;
            return;
        }

        unlockLootCrate();
    }, 1000);
}
async function startRewardAd() {
    if (!canUseRewardAd()) {
        toast('Bonus déjà pris', 'Reviens le prochain jour de survie pour récupérer une nouvelle caisse.', 'warning');
        closeRewardAdModal();
        return;
    }

    clearRewardAdTimer();

    if (rewardAdWatchBtn) rewardAdWatchBtn.disabled = true;
    if (rewardAdCloseBtn) rewardAdCloseBtn.disabled = true;

    const runtime = await initRewardedAds();
    const plugin = getAdMobPlugin();
    const adId = getRewardedAdUnitId();

    if (runtime.nativeAvailable && plugin && adId) {
        try {
            if (rewardAdText) {
                rewardAdText.textContent = 'Chargement de la pub récompensée AdMob...';
            }
            if (rewardAdCountdown) {
                rewardAdCountdown.textContent = 'Chargement';
            }

            await plugin.prepareRewardVideoAd({
                adId,
                isTesting: !!rewardAdConfig.testMode,
            });

            if (rewardAdCountdown) {
                rewardAdCountdown.textContent = 'Lecture';
            }
            if (rewardAdText) {
                rewardAdText.textContent = 'Pub en cours... attends la fin pour valider la caisse.';
            }

            await plugin.showRewardVideoAd();
            unlockLootCrate();
            return;
        } catch (error) {
            console.warn('Rewarded AdMob failed, fallback to simulation.', error);
            rewardAdRuntime.lastError = String(error?.message || error || 'Erreur inconnue');
            rewardAdRuntime.provider = 'Simulation';
            rewardAdRuntime.nativeAvailable = false;

            if (rewardAdProviderText) {
                rewardAdProviderText.textContent = 'AdMob indisponible sur cet environnement, fallback simulation activé.';
            }
            if (rewardAdProviderBadge) {
                rewardAdProviderBadge.textContent = 'SIMULATION';
            }

            toast('AdMob indisponible', 'Fallback simulation activé pour tester le flux de récompense.', 'warning');
        }
    }

    startRewardAdSimulation();
}

function pickRewardWheelSegment() {
    const total = rewardWheelSegments.reduce((sum, segment) => sum + segment.weight, 0);
    let roll = Math.random() * total;
    for (const segment of rewardWheelSegments) {
        roll -= segment.weight;
        if (roll <= 0) return segment;
    }
    return rewardWheelSegments[rewardWheelSegments.length - 1];
}

function spinRewardWheel() {
    if (!rewardWheel || !rewardSpinBtn || !rewardSpinResult || !rewardClaimBtn) return;
    if (rewardSpinLocked || pendingWheelReward) return;

    rewardSpinLocked = true;
    rewardSpinBtn.disabled = true;
    rewardWheel.classList.remove('opened');
    void rewardWheel.offsetWidth;
    rewardWheel.classList.add('opening');
    rewardSpinResult.className = 'reward-result locked';
    rewardSpinResult.textContent = 'Ouverture de la caisse en cours...';

    window.setTimeout(() => {
        const segment = pickRewardWheelSegment();
        pendingWheelReward = segment;
        rewardSpinLocked = false;
        rewardWheel.classList.remove('opening');
        rewardWheel.classList.add('opened');
        rewardSpinResult.className = 'reward-result ready';
        rewardSpinResult.textContent = `Lot obtenu : ${segment.desc}.`;
        rewardSpinBtn.classList.add('hidden');
        rewardClaimBtn.classList.remove('hidden');
    }, 1350);
}

function claimRewardWheelPrize() {
    if (!pendingWheelReward) return;

    Object.entries(pendingWheelReward.rewards).forEach(([resource, amount]) => {
        state.inventory[resource] = (state.inventory[resource] || 0) + amount;
    });

    state.rewardAds.lastClaimDay = state.day;
    state.rewardAds.totalClaims += 1;

    addLog(
        'Caisse de ravitaillement',
        `La caisse bonus te donne ${formatRewardsMap(pendingWheelReward.rewards)}.`,
        'Bonus'
    );

    toast(
        'Caisse récupérée',
        `Gains : ${formatRewardsMap(pendingWheelReward.rewards)}.`,
        'success'
    );

    pendingWheelReward = null;
    save();
    render();
    closeRewardAdModal();
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

    const template = pickWeightedByRarity(pool);

    if (!template) {
        toast('Recrutement impossible', 'Aucun profil valide disponible.', 'warning');
        return;
    }

    const colon = createColonistFromTemplate(template, state.colony.colonists.length);
    state.colony.colonists.push(colon);
    state.colony.recruitCooldown = 2;

    addLog(
        'Nouveau colon',
        `${colon.name} rejoint la colonie en tant que ${getRoleLabel(colon.role).toLowerCase()} (${getRarityLabel(colon.rarity).toLowerCase()}).`,
        'Colonie'
    );

    toast(
        'Nouveau survivant',
        `${colon.name} rejoint la colonie (${getRarityLabel(colon.rarity)}).`,
        template.rarity === 'legendary'
            ? 'success'
            : template.rarity === 'elite'
                ? 'success'
                : 'info',
        3200
    );

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
        } else if (c.role === 'defense') {
            c.fatigue = clamp(c.fatigue + randomInt(4, 8));
            c.morale = clamp(c.morale + 2);
            c.status = 'guarding';
        } else if (c.role === 'medicine') {
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
        } else if (c.role === 'construction') {
            state.inventory.materials += 1 + Math.floor((c.skills.construction + bonus.workshop) / 5);
            state.shelter = clamp(state.shelter + Math.max(1, Math.floor(c.skills.construction / 5)));

            c.fatigue = clamp(c.fatigue + randomInt(5, 9));
            c.status = 'working';
        } else if (c.role === 'production') {
            state.inventory.food += Math.max(1, Math.round(c.skills.production / 4));
            state.inventory.water += Math.max(1, Math.round(c.skills.production / 4));

            if (waterStationLevel > 0 && Math.random() < 0.35) {
                state.inventory.water += 1 + Math.floor(waterStationLevel / 2);
            }

            c.fatigue = clamp(c.fatigue + randomInt(4, 8));
            c.status = 'working';
        } else {
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
    } else if (colonists.length) {
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
    updateMerchantForNewDay();
    addLog('Début de survie', 'Tu sécurises l’abri tant bien que mal. Les réserves sont limitées, le danger monte dehors, et les prochaines heures vont décider si tu peux vraiment tenir.', 'Prologue');
    toggleGame(true);
    save();
    initRewardedAds().then(() => renderRewardAdPanel());
    render();
    if (!state.tutorialSeen) openTutorial(true);
    toast('Nouvelle partie', 'Bonne chance', 'success');
}

function continueGame() {
    const saved = load();
    if (!saved) {
        toast('Aucune sauvegarde', 'Commence une nouvelle partie.', 'warning');
        return;
    }
    state = normalizeState(saved);
    updateMerchantForNewDay();
    toggleGame(true);
    initRewardedAds().then(() => renderRewardAdPanel());
    render();
    if (!state.tutorialSeen) openTutorial(true);
    toast('Continuer', 'Sauvegarde chargée.', 'info');
}

function resetSave() {
    localStorage.removeItem(SAVE_KEY);
    if (continueBtn) continueBtn.disabled = true;
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

function updatePowerState() {
    const p = state.power;
    p.capacity = state.buildings.batteryBank.built ? 12 : 0;
    if (!state.buildings.batteryBank.built) p.stored = 0;
    p.generatorOn = !!state.buildings.generator.built && (state.inventory.fuel || 0) > 0;
    p.lightingOn = !!state.buildings.lighting.built;
    p.radioOn = !!state.buildings.radio.built;

    let generated = 0;
    let consumption = 0;
    let source = 'Aucun';
    const isDaytime = state.timeIndex <= 1;

    if (state.buildings.generator.built && state.inventory.fuel > 0) {
        state.inventory.fuel -= 1;
        generated += 4;
        state.noise = clamp(state.noise + 8);
        source = 'Générateur';
    }

    if (state.buildings.solarPanels.built && isDaytime) {
        const solarGain = state.weather === 'clear' ? 4 : state.weather === 'rain' ? 1 : state.weather === 'fog' ? 2 : 3;
        generated += solarGain;
        source = source === 'Aucun' ? 'Panneaux solaires' : `${source} + solaire`;
    }

    if (state.buildings.lighting.built) consumption += 1;
    if (state.buildings.radio.built) consumption += 1;

    if (p.capacity > 0) {
        p.stored = Math.min(p.capacity, p.stored + generated);
        if (consumption > 0) {
            const used = Math.min(consumption, p.stored);
            p.stored -= used;
            consumption -= used;
        }
    } else {
        consumption = Math.max(0, consumption - generated);
    }

    if (state.buildings.lighting.built && (generated > 0 || p.stored > 0 || consumption === 0)) {
        state.stats.morale = clamp(state.stats.morale + 1);
        state.danger = clamp(state.danger - 1);
    }

    if (state.buildings.radio.built) {
        state.stats.stress = clamp(state.stats.stress - 1);
        if (!state.merchant.active && state.merchant.nextVisitDay - state.day > 2) state.merchant.nextVisitDay -= 1;
    }

    if (consumption > 0) {
        state.stats.morale = clamp(state.stats.morale - 1);
        source = source === 'Aucun' ? 'Panne' : `${source} insuffisant`;
    }

    p.lastSource = source;
}


function pickWeightedByRarity(items) {
    if (!items.length) return null;

    const expanded = items.flatMap(item => {
        const weight = rarityWeights[item.rarity] || 1;
        return Array.from({ length: weight }, () => item);
    });

    return pick(expanded);
}

function getGarageVehicleByUid(uid) {
    return (state.vehicle.garage || []).find(vehicle => vehicle.uid === uid) || null;
}

function getActiveVehicle() {
    if (!state.vehicle.activeId) return null;
    return getGarageVehicleByUid(state.vehicle.activeId);
}

function createVehicleInstance(def) {
    return {
        ...def,
        uid: `veh_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        condition: randomInt(28, 64),
        repaired: false,
        operational: false
    };
}

function canSearchVehicle() {
    return state.day >= state.vehicle.unlockDay && !state.vehicle.pendingFound && state.vehicle.searchCooldown <= 0;
}

function searchVehicle() {
    if (state.day < state.vehicle.unlockDay) {
        toast('Garage fermé', `La recherche de véhicule se débloque au jour ${state.vehicle.unlockDay}.`, 'warning');
        return;
    }
    if (state.vehicle.pendingFound) {
        toast('Décision en attente', 'Choisis d’abord quoi faire du véhicule que tu viens de trouver.', 'info');
        return;
    }
    if (state.vehicle.searchCooldown > 0) {
        toast('Recherche impossible', `Il faut attendre encore ${state.vehicle.searchCooldown} jour(s).`, 'warning');
        return;
    }
    if (state.stats.energy < 14) {
        toast('Trop fatigué', 'Tu es trop fatigué pour fouiller toute une zone à la recherche d’un véhicule.', 'warning');
        return;
    }

    state.location = 'Périphérie';
    state.stats.energy = clamp(state.stats.energy - randomInt(9, 13));
    state.stats.thirst = clamp(state.stats.thirst - randomInt(5, 8));
    state.stats.hunger = clamp(state.stats.hunger - randomInt(4, 7));
    state.stats.stress = clamp(state.stats.stress + randomInt(3, 6));
    state.noise = clamp(state.noise + randomInt(2, 6));
    state.danger = clamp(state.danger + randomInt(3, 8));
    state.vehicle.lastSearchDay = state.day;

    const found = Math.random() < 0.65;
    if (!found) {
        state.vehicle.searchCooldown = 2;
        addLog('Recherche de véhicule', 'Tu fouilles des rues désertes sans trouver de machine récupérable.', 'Garage');
        toast('Aucun véhicule', 'Rien d’exploitable cette fois. Nouvelle tentative dans 2 jours.', 'warning');
        advanceTime();
        save();
        render();
        return;
    }

    const picked = pickWeightedByRarity(vehicleDefs);
    state.vehicle.pendingFound = createVehicleInstance(picked);
    state.vehicle.searchCooldown = 1;
    addLog('Véhicule repéré', `${picked.searchText} Tu dois maintenant décider quoi en faire.`, 'Garage');
    toast('Véhicule trouvé', picked.name, 'success');
    advanceTime();
    save();
    render();
}

function acceptPendingVehicle() {
    const pending = state.vehicle.pendingFound;
    if (!pending) return;
    state.vehicle.garage.push({ ...pending });
    if (!state.vehicle.activeId) state.vehicle.activeId = pending.uid;
    state.vehicle.pendingFound = null;
    addLog('Garage', `${pending.name} entre dans le garage improvisé.`, 'Garage');
    toast('Garage', `${pending.name} conservé.`, 'success');
    save();
    render();
}

function getScrapYield(vehicle) {
    const yieldMap = {
        bike: { materials: 2 },
        scooter: { materials: 2, fuel: 1 },
        motorbike: { materials: 3, fuel: 1 },
        compact: { materials: 4, fuel: 1 },
        pickup: { materials: 5, fuel: 2 },
        van: { materials: 6, fuel: 2 }
    };
    return yieldMap[vehicle.id] || { materials: 2 };
}

function scrapPendingVehicle() {
    const pending = state.vehicle.pendingFound;
    if (!pending) return;
    const loot = getScrapYield(pending);
    Object.entries(loot).forEach(([k, v]) => {
        state.inventory[k] = (state.inventory[k] || 0) + v;
    });
    state.vehicle.pendingFound = null;
    addLog('Démontage', `${pending.name} est démonté pour récupérer ${Object.entries(loot).map(([k,v]) => `${v} ${resourceLabels[k] || k}`).join(', ')}.`, 'Garage');
    toast('Démontage', 'Tu récupères quelques pièces utiles.', 'info');
    save();
    render();
}

function refusePendingVehicle() {
    const pending = state.vehicle.pendingFound;
    if (!pending) return;
    state.vehicle.pendingFound = null;
    addLog('Occasion laissée', `${pending.name} est abandonné sur place.`, 'Garage');
    toast('Véhicule refusé', 'Tu pourras chercher autre chose plus tard.', 'info');
    save();
    render();
}

function repairGarageVehicle(uid) {
    const current = getGarageVehicleByUid(uid);
    if (!current || current.repaired) return;
    if (!payCost(current.repairCost)) {
        toast('Réparation impossible', 'Ressources insuffisantes pour remettre ce véhicule en état.', 'warning');
        return;
    }
    current.repaired = true;
    current.operational = true;
    current.condition = clamp(current.condition + randomInt(22, 35));
    addLog('Réparation véhicule', `${current.name} est maintenant opérationnel.`, 'Garage');
    toast('Garage', `${current.name} prêt pour les sorties.`, 'success');
    save();
    render();
}

function equipVehicle(uid) {
    const vehicle = getGarageVehicleByUid(uid);
    if (!vehicle) return;
    state.vehicle.activeId = uid;
    toast('Véhicule actif', `${vehicle.name} sera utilisé pour les sorties.`, 'info');
    save();
    render();
}

function removeVehicleFromGarage(uid) {
    const vehicle = getGarageVehicleByUid(uid);
    if (!vehicle) return;
    state.vehicle.garage = state.vehicle.garage.filter(v => v.uid !== uid);
    if (state.vehicle.activeId === uid) state.vehicle.activeId = state.vehicle.garage[0]?.uid || null;
    addLog('Garage', `${vehicle.name} est retiré du garage.`, 'Garage');
    toast('Garage', `${vehicle.name} retiré.`, 'warning');
    save();
    render();
}

function getVehicleExplorationBonus(mode) {
    const current = getActiveVehicle();
    if (!current || !current.operational) return { extraLoot: 0, riskMod: 0, noise: 0, fuelUse: 0, vehicleName: null };
    for (const [resource, amount] of Object.entries(current.upkeep || {})) {
        if ((state.inventory[resource] || 0) < amount) {
            return { extraLoot: 0, riskMod: 0, noise: 0, fuelUse: 0, vehicleName: null };
        }
    }
    for (const [resource, amount] of Object.entries(current.upkeep || {})) {
        state.inventory[resource] -= amount;
    }
    return {
        extraLoot: mode === 'dangerous' ? current.dangerousBonusLoot : current.bonusLoot,
        riskMod: current.riskMod,
        noise: current.noise,
        fuelUse: current.fuelUse,
        vehicleName: current.name
    };
}

function buildStructure(id) {

    const def = buildingDefs.find(b => b.id === id);
    if (!def) return;

    if (state.buildings[id].built) {
        toast('Déjà construit', 'Cette amélioration est déjà en place.', 'info');
        return;
    }

    if (id === 'solarPanels' && state.day < 12) {
        toast('Trop tôt', 'Les panneaux solaires se débloquent plutôt vers le jour 12.', 'warning');
        return;
    }
    if ((id === 'lighting' || id === 'radio') && !state.buildings.generator.built && !state.buildings.solarPanels.built) {
        toast('Pas de courant', 'Il faut une source de production électrique avant d’installer cet équipement.', 'warning');
        return;
    }
    if (id === 'batteryBank' && !state.buildings.generator.built && !state.buildings.solarPanels.built) {
        toast('Inutile pour le moment', 'Installe d’abord une vraie source d’électricité.', 'warning');
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
        if (state.vehicle.searchCooldown > 0) state.vehicle.searchCooldown -= 1;
        rollWeather();
        updateMerchantForNewDay();
        applyPassiveProduction();
        processColonyDay();
        updatePowerState();
        nightEvent();
    }

    checkDeath();
}

function nightEvent() {
    let attackRisk = state.danger + state.noise - Math.floor(state.shelter / 2) - state.nightGuard;
    state.nightGuard = 0;

    if (attackRisk > 60) {
        const dmg = randomInt(6, 9);
        const shelterDmg = randomInt(8, 10);
        const stressGain = randomInt(5, 9);

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
    if (moreActionsPanel && !moreActionsPanel.classList.contains('hidden')) {
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
            state.shelter = clamp(state.shelter + 22);
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
            state.stats.stress = clamp(state.stats.stress - randomInt(18, 30));
            state.stats.morale = clamp(state.stats.morale + randomInt(12, 17));
            state.stats.energy = clamp(state.stats.energy + 4);
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

    const vehicleBonus = getVehicleExplorationBonus(mode);
    const rewards = {};
    Object.entries(loc.rewards).forEach(([k, [min, max]]) => {
        rewards[k] = randomInt(min, max);
    });

    if (vehicleBonus.extraLoot > 0) {
        const bonusResource = pick(Object.keys(loc.rewards));
        rewards[bonusResource] = (rewards[bonusResource] || 0) + vehicleBonus.extraLoot;
    }

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
    state.noise = clamp(state.noise + randomInt(mode === 'dangerous' ? 10 : 6, mode === 'dangerous' ? 18 : 14) + vehicleBonus.noise);
    state.danger = clamp(state.danger + randomInt(mode === 'dangerous' ? 8 : 4, mode === 'dangerous' ? 14 : 10) + vehicleBonus.riskMod);

    addLog(
        mode === 'dangerous' ? 'Expédition dangereuse' : 'Exploration',
        `Tu fouilles ${loc.name} et récupères ${formatRewardText(rewards)}. Énergie -${energyCost}, stress +${stressGain}.${vehicleBonus.vehicleName ? ` ${vehicleBonus.vehicleName} apporte un bonus logistique.` : ''}`,
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
        ['❤️', 'Santé', `${state.stats.health}%`],
        ['🍖', 'Faim', `${state.stats.hunger}%`],
        ['💧', 'Soif', `${state.stats.thirst}%`],
        ['⚡', 'Énergie', `${state.stats.energy}%`],
        ['🙂', 'Moral', `${state.stats.morale}%`],
        ['🧠', 'Stress', `${state.stats.stress}%`]
    ].map(([i, l, v]) => `
    <div class="sticky-pill">
      <span class="icon">${i}</span>
      <div>
        <strong>${v}</strong>
        <span>${l}</span>
      </div>
    </div>
  `).join('');

    stickyResources.innerHTML = [
        ['clock', `Jour ${state.day}`, timeSlots[state.timeIndex]],
        ['weather', 'Météo', getWeatherLabel(state.weather)],
        ['food', 'Nourriture', state.inventory.food],
        ['water', 'Eau', state.inventory.water],
        ['materials', 'Matériaux', state.inventory.materials],
        ['bandage', 'Bandages', state.inventory.bandage],
        ['ammo', 'Munitions', state.inventory.ammo],
        ['fuel', 'Carburant', state.inventory.fuel]
    ].map(([k, l, v]) => {
        const icon = k === 'clock' ? '🕒' : (k === 'weather' ? '' : icons[k]);
        const compactClass = k === 'weather' ? ' sticky-pill--weather' : '';
        const iconHtml = icon ? `<span class="icon">${icon}</span>` : '';
        const valueHtml = k === 'weather'
            ? `<span class="sticky-weather-value">${v}</span>`
            : `<strong>${v}</strong>`;
        return `
    <div class="sticky-pill${compactClass}">
      ${iconHtml}
      <div>
        <strong>${l}</strong>
        ${valueHtml}
      </div>
    </div>
  `;
    }).join('');

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
        { label: 'Lieu actuel', value: state.location },
        { label: 'Électricité stockée', value: `${state.power.stored}/${state.power.capacity || 0}` },
        { label: 'Source active', value: state.power.lastSource }
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

function renderRewardAdPanel() {
    if (!rewardAdPanel || !rewardAdStatus) return;
    const available = canUseRewardAd();
    rewardAdStatus.textContent = available
        ? 'Une caisse bonus est disponible aujourd’hui'
        : `Convoi déjà récupéré au jour ${state.rewardAds.lastClaimDay}`;

    if (rewardAdModeBadge) {
        rewardAdModeBadge.textContent = rewardAdRuntime.nativeAvailable
            ? (rewardAdConfig.testMode ? 'AdMob test' : 'AdMob live')
            : 'Simulation';
    }

    rewardAdPanel.innerHTML = `
      <article class="reward-ad-panel reward-ad-panel--supply">
        <div class="reward-ad-hero">
          <div class="reward-ad-radio-visual" aria-hidden="true">
            <span class="reward-radio-dot"></span>
            <span class="reward-radio-ring reward-radio-ring--one"></span>
            <span class="reward-radio-ring reward-radio-ring--two"></span>
            <span class="reward-radio-ring reward-radio-ring--three"></span>
            <div class="reward-drop-crate-mini">DROP</div>
          </div>
          <div class="reward-ad-panel-copy">
            <div class="reward-ad-title-row">
              <div>
                <strong>${available ? 'Signal capté : convoi en approche' : 'Fréquence silencieuse'}</strong>
                <p>${available ? 'Une fréquence pirate diffuse un signal sponsorisé. Regarde la pub, verrouille la zone puis ouvre une caisse de survie abandonnée.' : 'Le ravitaillement radio du jour a déjà été sécurisé. Il faudra attendre le prochain jour pour relancer la balise.'}</p>
              </div>
              <span class="reward-ad-chip">${available ? 'Disponible' : 'Indisponible'}</span>
            </div>
            <div class="reward-ad-action-row">
              <button class="btn ${available ? 'primary' : ''}" data-open-reward-ad ${available ? '' : 'disabled'}>
                <strong>${available ? 'Ouvrir le ravitaillement' : 'Revenir demain'}</strong>
                <span>${available ? 'Lancer la pub puis ouvrir la caisse' : 'Le convoi est déjà tombé aujourd’hui'}</span>
              </button>
            </div>
          </div>
        </div>
      </article>
    `;

    renderRewardQuickAccess();
}

function renderRewardQuickAccess() {
    if (!rewardQuickAccess) return;
    const available = canUseRewardAd();
    rewardQuickAccess.classList.toggle('hidden', !available);
    if (!available) {
        rewardQuickAccess.innerHTML = '';
        return;
    }
    rewardQuickAccess.innerHTML = `
      <button class="reward-quick-btn panel" data-open-reward-section>
        <span class="reward-quick-btn__pulse" aria-hidden="true"></span>
        <span class="reward-quick-btn__icon">📻</span>
        <span class="reward-quick-btn__copy">
          <strong>Convoi radio disponible</strong>
          <small>Accéder vite au ravitaillement bonus</small>
        </span>
        <span class="reward-quick-btn__cta">Voir</span>
      </button>
    `;
}

function renderBuildings() {
    const powerSummary = `
      <article class="building-card building-card--power">
        <div class="building-top">
          <strong>Réseau électrique</strong>
          <span class="badge loot">${state.power.stored}/${state.power.capacity || 0} charge</span>
        </div>
        <p class="modal-text">Source : ${state.power.lastSource}. Le générateur apporte un courant stable mais consomme du carburant et fait du bruit. Les batteries stockent l’énergie pour la nuit. Les panneaux solaires donnent surtout en journée.</p>
      </article>
    `;

    buildingsGrid.innerHTML = powerSummary + buildingDefs.map(def => {
        const built = state.buildings[def.id].built;
        const locked = def.id === 'solarPanels' && state.day < 12;
        const costTextLocal = Object.entries(def.cost).map(([k, v]) => `${icons[k] || ''} ${v} ${resourceLabels[k] || k}`).join(', ');

        return `
      <article class="building-card">
        <div class="building-top">
          <strong>${def.name}</strong>
          <span class="badge ${built ? 'good' : locked ? 'danger' : 'loot'}">${built ? 'Construit' : locked ? 'Jour 12' : 'À construire'}</span>
        </div>
        <p class="modal-text">${def.desc}</p>
        <div class="location-meta">
          <span class="badge">${costTextLocal}</span>
        </div>
        <button class="btn ${built || locked ? '' : 'primary'} build-btn" data-building="${def.id}" ${(built || locked) ? 'disabled' : ''}>
          <strong>${built ? 'Déjà installé' : locked ? 'Encore verrouillé' : 'Construire'}</strong>
          <span>${built ? 'Amélioration active dans l’abri' : locked ? 'Disponible plus tard' : 'Lancer la construction'}</span>
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


function renderMerchant() {
    if (!merchantPanel || !merchantStatusLabel) return;
    if (merchantToggle) {
        merchantToggle.classList.toggle('accordion-highlight', !!state.merchant.active);
        merchantToggle.classList.toggle('accordion-pulse', !!state.merchant.active);
    }

    if (!state.merchant.active) {
        merchantStatusLabel.textContent = `Prochain passage estimé : jour ${state.merchant.nextVisitDay}`;
        merchantPanel.innerHTML = `
            <div class="merchant-card merchant-card--idle">
                <div class="merchant-hero">
                    <div>
                        <strong>Aucun marchand dans le secteur</strong>
                        <p>Les fréquences radio restent calmes. Le prochain passage est estimé autour du jour ${state.merchant.nextVisitDay}.</p>
                    </div>
                    <span class="merchant-badge">Hors zone</span>
                </div>
                <div class="merchant-note-grid">
                    <article class="merchant-note"><strong>Fréquence</strong><span>1 visite tous les 5 à 7 jours</span></article>
                    <article class="merchant-note"><strong>Prix</strong><span>Variables selon le marché et ton stock</span></article>
                </div>
            </div>
        `;
        return;
    }

    const profile = getMerchantProfile();
    merchantStatusLabel.textContent = `${profile.name} • Départ prévu après la nuit`;
    const giveOptions = lootableResources.map(resource => `<option value="${resource}">${icons[resource]} ${resourceLabels[resource]} (${state.inventory[resource] || 0})</option>`).join('');
    const receiveOptions = lootableResources.map(resource => `<option value="${resource}">${icons[resource]} ${resourceLabels[resource]} • ${getMerchantMoodLabel(resource)}</option>`).join('');
    const trendCards = lootableResources.map(resource => `
        <article class="merchant-trend-row merchant-trend-row--compact merchant-trend-card">
            <div class="merchant-resource-main">
                <strong>${icons[resource]} ${resourceLabels[resource]}</strong>
                <small>Pour 1 unité</small>
            </div>
            <span class="merchant-trend-state">${getMerchantMoodLabel(resource)}</span>
            <div class="merchant-prices merchant-prices--compact">
                <span title="Coût pour obtenir 1 ${resourceLabels[resource]}">Acheter ${getMerchantBuyPrice(resource)}</span>
                <span title="Valeur obtenue si tu revends 1 ${resourceLabels[resource]}">Revendre ${getMerchantSellPrice(resource)}</span>
            </div>
        </article>
    `).join('');

    merchantPanel.innerHTML = `
        <div class="merchant-card merchant-card--live">
            <div class="merchant-hero">
                <div>
                    <strong>${profile.name}</strong>
                    <p>${profile.desc} Lecture simple : acheter = coût pour recevoir 1 unité. Revendre = valeur d’1 unité que tu lui donnes.</p>
                </div>
                <span class="merchant-badge live">${profile.badge || 'En place'}</span>
            </div>

            <div class="merchant-legend">
                <span><strong>Acheter</strong> = ce que tu dois donner pour obtenir 1 ressource</span>
                <span><strong>Revendre</strong> = valeur de 1 ressource si tu l’échanges</span>
            </div>

            <div class="merchant-quote"><strong>Cours du jour</strong><span>Chaque ligne indique le prix pour obtenir 1 unité et la valeur de revente d’1 unité de ton stock.</span></div><div class="merchant-trend-grid merchant-trend-grid--cards">${trendCards}</div>

            <div class="merchant-exchange-box">
                <div class="merchant-select-grid">
                    <label>
                        <span>Tu donnes</span>
                        <select id="merchantGiveSelect">${giveOptions}</select>
                    </label>
                    <label>
                        <span>Tu veux</span>
                        <select id="merchantReceiveSelect">${receiveOptions}</select>
                    </label>
                </div>
                <div class="merchant-quote" id="merchantQuote"></div>
                <button class="btn primary merchant-trade-btn" id="merchantTradeBtn">
                    <strong>Faire le troc</strong>
                    <span>Échange immédiat</span>
                </button>
            </div>
        </div>
    `;

    const giveSelect = $('merchantGiveSelect');
    const receiveSelect = $('merchantReceiveSelect');
    const quoteBox = $('merchantQuote');
    const tradeBtn = $('merchantTradeBtn');

    const updateQuote = () => {
        if (!giveSelect || !receiveSelect || !quoteBox) return;
        const give = giveSelect.value;
        let receive = receiveSelect.value;
        if (give === receive) {
            receive = lootableResources.find(r => r !== give) || give;
            receiveSelect.value = receive;
        }
        const quote = getMerchantTradeQuote(give, receive);
        quoteBox.innerHTML = quote
            ? `<strong>Troc actuel</strong><span>Donner ${quote.cost} ${icons[give]} ${resourceLabels[give]} pour recevoir ${quote.receiveAmount} ${icons[receive]} ${resourceLabels[receive]}.</span>`
            : `<strong>Troc actuel</strong><span>Choisis deux ressources différentes.</span>`;
    };

    giveSelect?.addEventListener('change', updateQuote);
    receiveSelect?.addEventListener('change', updateQuote);
    tradeBtn?.addEventListener('click', () => makeMerchantTrade(giveSelect.value, receiveSelect.value));
    updateQuote();
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
          <article class="colony-upgrade-card ${getRoleClass(def.role)} accordion-card">
            <button class="accordion-trigger accordion-trigger--inner" aria-expanded="false">
              <span>
                <strong>${def.name}</strong>
                <small>${def.desc}</small>
              </span>
              <span class="accordion-trigger-right">
                <span class="badge ${maxed ? 'good' : 'loot'}">Niv. ${level}${maxed ? ' • Max' : ''}</span>
                <span class="accordion-icon">+</span>
              </span>
            </button>
            <div class="accordion-content hidden">
              <div class="accordion-card-body">
                <div class="colony-upgrade-bottom">
                  <div class="colony-upgrade-bonus">${maxed ? 'Amélioration maximale' : next.bonus}</div>
                  <button class="btn ${maxed ? '' : 'primary'} colony-upgrade-btn" data-upgrade="${def.id}" ${maxed ? 'disabled' : ''}>
                    <strong>${maxed ? 'Max atteint' : 'Améliorer'}</strong>
                    <span>${maxed ? 'Aucun niveau supplémentaire' : Object.entries(next.cost).map(([k, v]) => `${icons[k] || '📦'} ${v}`).join(' • ')}</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        `;
    }).join('');

    const colonHtml = state.colony.colonists.map(colon => {
        const initials = colon.name.split(' ').map(x => x[0]).slice(0, 2).join('').toUpperCase();
        return `
          <article class="colon-card ${getRoleClass(colon.role)} rarity-${colon.rarity} status-${colon.status} accordion-card">
            <button class="accordion-trigger accordion-trigger--inner colon-card-top colon-card-top--compact" aria-expanded="false">
              <div class="colon-avatar-wrap">
                <div class="colon-avatar">${initials}</div>
                <span class="rarity-pill">${getRarityLabel(colon.rarity)}</span>
              </div>
              <div class="colon-identity">
                <h3>${colon.name}</h3>
                <p>${colon.age} ans • ${getRoleLabel(colon.role)}</p>
              </div>
              <div class="colon-card-head-right">
                <div class="status-pill">${getColonStatusLabel(colon.status)}</div>
                <span class="accordion-icon">+</span>
              </div>
            </button>
            <div class="accordion-content hidden">
              <div class="accordion-card-body">
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
              </div>
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
    colonyPanel.querySelectorAll('.accordion-card .accordion-trigger').forEach(trigger => {
        const content = trigger.parentElement.querySelector('.accordion-content');
        if (content) trigger.addEventListener('click', () => toggleAccordion(trigger, content));
    });
    colonyPanel.querySelectorAll('[data-colon-role]').forEach(btn => btn.addEventListener('click', () => {
        const [id, role] = btn.dataset.colonRole.split('|');
        assignColonistRole(id, role);
    }));
}


function renderVehicle() {
    if (!vehiclePanel || !vehicleHeadText) return;

    if (state.day < state.vehicle.unlockDay) {
        vehicleHeadText.textContent = `Disponible au jour ${state.vehicle.unlockDay}`;
        vehiclePanel.innerHTML = `
            <div class="colony-gate">
                <div class="colony-gate-copy">
                    <p class="colony-kicker">Garage improvisé</p>
                    <h3>Zone véhicule verrouillée</h3>
                    <p>Le groupe n’a pas encore assez avancé pour sécuriser une zone véhicule. Survis jusqu’au jour ${state.vehicle.unlockDay}.</p>
                </div>
                <div class="colony-gate-cta">
                    <div class="colony-gate-card">
                        <strong>Jour ${state.day} / ${state.vehicle.unlockDay}</strong>
                        <small>Débloque la recherche de véhicules récupérables.</small>
                    </div>
                </div>
            </div>
        `;
        return;
    }

    const pending = state.vehicle.pendingFound;
    const garage = state.vehicle.garage || [];
    const active = getActiveVehicle();
    vehicleHeadText.textContent = active ? `Garage improvisé • ${garage.length} véhicule(s) • actif : ${active.name}` : `Garage improvisé • ${garage.length} véhicule(s)`;

    const pendingCard = pending ? `
        <div class="vehicle-card vehicle-card--pending">
            <div class="vehicle-headline">
                <div>
                    <strong>Véhicule trouvé : ${pending.name}</strong>
                    <p>${pending.desc}</p>
                </div>
                <span class="rarity-pill">${getRarityLabel(pending.rarity)}</span>
            </div>
            <div class="merchant-note-grid vehicle-note-grid">
                <article class="merchant-note"><strong>État</strong><span>${pending.condition}%</span></article>
                <article class="merchant-note"><strong>Bruit</strong><span>${pending.noise >= 0 ? '+' : ''}${pending.noise}</span></article>
                <article class="merchant-note"><strong>Capacité</strong><span>+${pending.cargo}</span></article>
                <article class="merchant-note"><strong>Entretien</strong><span>${Object.entries(pending.upkeep || {}).map(([k, v]) => `${v} ${resourceLabels[k] || k}`).join(' • ') || 'léger'}</span></article>
                <article class="merchant-note"><strong>Conso</strong><span>${pending.fuelUse} carburant</span></article>
                <article class="merchant-note"><strong>Bonus loot</strong><span>+${pending.bonusLoot} / +${pending.dangerousBonusLoot}</span></article>
            </div>
            <div class="vehicle-actions-row">
                <button class="btn primary" id="acceptVehicleBtn">Garder</button>
                <button class="btn" id="refuseVehicleBtn">Refuser</button>
                <button class="btn" id="scrapVehicleBtn">Démonter / récupérer des pièces</button>
            </div>
        </div>` : '';

    const searchCard = `
        <div class="vehicle-card vehicle-card--search">
            <div class="vehicle-headline">
                <div>
                    <strong>Rechercher un véhicule</strong>
                    <p>Tu peux stocker plusieurs véhicules dans le garage, mais un seul est équipé pour les sorties. Refuser ou démonter une trouvaille te permet de repartir en chasse plus tard.</p>
                </div>
            </div>
            <div class="vehicle-specs">
                <span class="badge">65% de chance de trouver quelque chose</span>
                <span class="badge">Garder, refuser ou démonter</span>
                <span class="badge">Recherche impossible tant qu’une décision est en attente</span>
            </div>
            <button class="btn primary vehicle-main-btn" id="searchVehicleBtn" ${canSearchVehicle() ? '' : 'disabled'}>
                <strong>Lancer une recherche</strong>
                <span>${pending ? 'Décision en attente sur le dernier véhicule trouvé' : state.vehicle.searchCooldown > 0 ? `Encore ${state.vehicle.searchCooldown} jour(s) de délai` : 'Prend du temps, augmente un peu le danger'}</span>
            </button>
        </div>`;

    const garageCards = garage.length ? garage.map(vehicle => `
        <div class="vehicle-card vehicle-card--live ${state.vehicle.activeId === vehicle.uid ? 'is-active' : ''}">
            <div class="vehicle-headline">
                <div>
                    <strong>${vehicle.name}</strong>
                    <p>${vehicle.desc}</p>
                </div>
            </div>
            <div class="merchant-note-grid vehicle-note-grid">
                <article class="merchant-note"><strong>État</strong><span>${vehicle.condition}%</span></article>
                <article class="merchant-note"><strong>Bruit</strong><span>${vehicle.noise >= 0 ? '+' : ''}${vehicle.noise}</span></article>
                <article class="merchant-note"><strong>Capacité</strong><span>+${vehicle.cargo}</span></article>
                <article class="merchant-note"><strong>Entretien</strong><span>${Object.entries(vehicle.upkeep || {}).map(([k, v]) => `${v} ${resourceLabels[k] || k}`).join(' • ') || 'léger'}</span></article>
                <article class="merchant-note"><strong>Conso</strong><span>${vehicle.fuelUse} carburant</span></article>
                <article class="merchant-note"><strong>Bonus loot</strong><span>+${vehicle.bonusLoot} / +${vehicle.dangerousBonusLoot}</span></article>
            </div>
            <div class="merchant-legend">
                <span><strong>Réparation</strong> : ${Object.entries(vehicle.repairCost || {}).map(([k, v]) => `${icons[k] || '📦'} ${v}`).join(' • ')}</span>
                <span><strong>Statut</strong> : ${vehicle.operational ? 'Opérationnel' : 'À réparer'}</span>
            </div>
            <div class="vehicle-actions-row">
                <button class="btn primary" data-repair-vehicle="${vehicle.uid}" ${vehicle.repaired ? 'disabled' : ''}>${vehicle.repaired ? 'Déjà réparé' : 'Réparer'}</button>
                <button class="btn" data-equip-vehicle="${vehicle.uid}" ${state.vehicle.activeId === vehicle.uid ? 'disabled' : ''}>${state.vehicle.activeId === vehicle.uid ? 'Équipé' : 'Équiper pour les sorties'}</button>
                <button class="btn" data-remove-vehicle="${vehicle.uid}">Retirer du garage</button>
            </div>
        </div>
    `).join('') : `<div class="vehicle-card vehicle-card--search"><div class="vehicle-headline"><div><strong>Garage vide</strong><p>Tu n’as encore conservé aucun véhicule. Le premier trouvé pourra devenir ton véhicule actif.</p></div></div></div>`;

    vehiclePanel.innerHTML = `<div class="vehicle-garage-stack">${pendingCard}${searchCard}<div class="vehicle-garage-grid">${garageCards}</div></div>`;

    const searchBtn = $('searchVehicleBtn');
    if (searchBtn) searchBtn.addEventListener('click', searchVehicle);
    const acceptBtn = $('acceptVehicleBtn');
    if (acceptBtn) acceptBtn.addEventListener('click', acceptPendingVehicle);
    const refuseBtn = $('refuseVehicleBtn');
    if (refuseBtn) refuseBtn.addEventListener('click', refusePendingVehicle);
    const scrapBtn = $('scrapVehicleBtn');
    if (scrapBtn) scrapBtn.addEventListener('click', scrapPendingVehicle);

    vehiclePanel.querySelectorAll('[data-repair-vehicle]').forEach(btn => btn.addEventListener('click', () => repairGarageVehicle(btn.dataset.repairVehicle)));
    vehiclePanel.querySelectorAll('[data-equip-vehicle]').forEach(btn => btn.addEventListener('click', () => equipVehicle(btn.dataset.equipVehicle)));
    vehiclePanel.querySelectorAll('[data-remove-vehicle]').forEach(btn => btn.addEventListener('click', () => removeVehicleFromGarage(btn.dataset.removeVehicle)));
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


function syncStickySpacer() {
    if (!stickyActionsSpacer || !stickyActions) return;
    const hidden = stickyActions.classList.contains('hidden');
    const height = hidden ? 0 : stickyActions.offsetHeight;
    stickyActionsSpacer.style.height = `${height + 12}px`;
}

function render() {
    renderHeader();
    renderSticky();
    renderStats();
    renderChips();
    renderOverview();
    renderRewardAdPanel();
    renderBuildings();
    renderColony();
    renderVehicle();
    renderSimpleLocations();
    renderDangerousLocations();
    renderInventory();
    renderMerchant();
    renderJournal();
    renderActionLabels();
    syncStickySpacer();
}

const tutorialBackdrop = tutorialModal?.querySelector('.modal-backdrop');
const rewardBackdrop = rewardAdModal?.querySelector('.modal-backdrop');

if (tutorialBackdrop) {
    tutorialBackdrop.addEventListener('click', () => closeTutorial(false));
}

if (rewardBackdrop) {
    rewardBackdrop.addEventListener('click', closeRewardAdModal);
}

(function init() {
    const saved = load();
    if (continueBtn) continueBtn.disabled = !saved;
    if (saved) state = normalizeState(saved);
    renderRewardWheel();
})();