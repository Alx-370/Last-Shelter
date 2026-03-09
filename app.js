const SAVE_KEY='last_shelter_v6_1_save';

const timeSlots=['Matin','Après-midi','Soir','Nuit'];

const weatherDefs=[
    {id:'clear',label:'☀️ Temps clair'},
    {id:'rain',label:'🌧️ Pluie froide'},
    {id:'fog',label:'🌫️ Brouillard'},
    {id:'cold',label:'❄️ Froid sec'}
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

const simpleLocations=[
    {
        id:'house',
        name:'Maison abandonnée',
        risk:28,
        loot:'nourriture',
        desc:'Placards vides mais parfois encore utiles.',
        rewards:{food:[1,3],water:[0,1],materials:[0,2],bandage:[0,1]}
    },
    {
        id:'garage',
        name:'Garage local',
        risk:34,
        loot:'matériaux',
        desc:'Ferraille, outils et bazar mécanique.',
        rewards:{materials:[1,3],water:[0,1],fuel:[0,1]}
    },
    {
        id:'apartment',
        name:'Appartement vide',
        risk:30,
        loot:'eau',
        desc:'Peu de place, peu de bruit, peu de surprise.',
        rewards:{food:[0,2],water:[1,2],bandage:[0,1]}
    },
    {
        id:'shop',
        name:'Petite supérette',
        risk:38,
        loot:'provisions',
        desc:'Quelques rayons encore exploitables.',
        rewards:{food:[1,3],water:[1,2],materials:[0,1]}
    }
];

const dangerousLocations=[
    {
        id:'hospital',
        name:'Hôpital',
        risk:72,
        loot:'médical',
        cost:{ammo:2},
        desc:'Très riche mais infecté et instable.',
        rewards:{bandage:[2,4],medicine:[1,3],food:[0,1],water:[0,1]}
    },
    {
        id:'police',
        name:'Commissariat',
        risk:78,
        loot:'munitions',
        cost:{ammo:2,fuel:1},
        desc:'Zone tendue avec gros potentiel de loot.',
        rewards:{ammo:[2,5],materials:[1,3],bandage:[0,1]}
    },
    {
        id:'station',
        name:'Station-service',
        risk:64,
        loot:'carburant',
        cost:{ammo:1,fuel:1},
        desc:'Exposée mais utile pour durer.',
        rewards:{fuel:[2,4],water:[0,1],materials:[1,2]}
    },
    {
        id:'warehouse',
        name:'Entrepôt',
        risk:70,
        loot:'gros stock',
        cost:{ammo:2},
        desc:'Grand espace, gros bruit, bonne rentabilité.',
        rewards:{food:[2,5],materials:[2,5],water:[1,2]}
    }
];

const buildingDefs=[
    {id:'rainCollector',name:'Récupérateur d’eau',desc:'Produit de l’eau pendant la pluie.',cost:{materials:4}},
    {id:'garden',name:'Petit potager',desc:'Produit de la nourriture tous les quelques jours.',cost:{materials:5,water:1}},
    {id:'medicalCorner',name:'Coin médical',desc:'Rend les soins plus efficaces.',cost:{materials:4,medicine:1}},
    {id:'bed',name:'Lit amélioré',desc:'Dormir récupère davantage d’énergie.',cost:{materials:3,food:1}}
];

const simpleEvents=[
    {
        title:'Placard oublié',
        text:'Un meuble mal fermé contient encore quelque chose.',
        choices:[
            {
                label:'Fouiller',
                desc:'Petit gain possible',
                effect(s){
                    s.inventory.food+=1;
                    s.statsSummary.resourcesFound+=1;
                    addLog('Placard oublié','Tu trouves une ration coincée derrière une boîte vide.','Événement');
                    toast('Petit gain','+1 ration.','success');
                }
            },
            {
                label:'Laisser',
                desc:'Ne pas perdre de temps',
                effect(s){
                    s.stats.stress=clamp(s.stats.stress-1);
                    addLog('Prudence','Tu laisses tomber pour éviter de traîner.','Événement');
                    toast('Prudence','Tu gardes le contrôle.','info');
                }
            }
        ]
    },
    {
        title:'Coupure sale',
        text:'En forçant un tiroir, tu te coupes sur un éclat rouillé.',
        choices:[
            {
                label:'Continuer',
                desc:'Risque d’infection',
                effect(s){
                    s.stats.health=clamp(s.stats.health-4);
                    s.stats.infection=clamp(s.stats.infection+8);
                    addLog('Coupure sale','La blessure est légère, mais l’infection monte.','Danger');
                    toast('Infection','Infection +8. Santé -4.','danger');
                }
            },
            {
                label:'Rentrer',
                desc:'Limiter les dégâts',
                effect(s){
                    s.stats.health=clamp(s.stats.health-2);
                    s.stats.infection=clamp(s.stats.infection+3);
                    addLog('Retour rapide','Tu rentres immédiatement après la coupure.','Danger');
                    toast('Blessure','Infection +3. Santé -2.','warning');
                }
            }
        ]
    }
];

const dangerousEvents=[
    {
        title:'Air contaminé',
        text:'L’air du bâtiment te brûle la gorge et les yeux.',
        choices:[
            {
                label:'Forcer encore un peu',
                desc:'Loot possible, infection',
                effect(s){
                    s.stats.infection=clamp(s.stats.infection+12);
                    s.inventory.medicine+=1;
                    s.statsSummary.resourcesFound+=1;
                    addLog('Air contaminé','Tu insistes malgré l’air toxique et récupères un médicament.','Danger');
                    toast('Air contaminé','Infection +12, +1 médicament.','danger');
                }
            },
            {
                label:'Sortir vite',
                desc:'Rester prudent',
                effect(s){
                    s.stats.stress=clamp(s.stats.stress-1);
                    addLog('Repli prudent','Tu préfères sortir avant d’aggraver ton état.','Danger');
                    toast('Prudence','Tu évites le pire.','info');
                }
            }
        ]
    },
    {
        title:'Salle infestée',
        text:'Une zone très exposée semble cacher un gros stock.',
        choices:[
            {
                label:'Tenter le tout pour le tout',
                desc:'Risque élevé, gros gain',
                effect(s){
                    s.stats.health=clamp(s.stats.health-6);
                    s.stats.infection=clamp(s.stats.infection+10);
                    s.inventory.materials+=2;
                    s.statsSummary.resourcesFound+=2;
                    addLog('Salle infestée','Tu forces le passage et ressors avec du matériel.','Danger');
                    toast('Sortie brutale','Santé -6, infection +10, +2 matériaux.','danger');
                }
            },
            {
                label:'Abandonner',
                desc:'Ne pas tout risquer',
                effect(s){
                    s.stats.morale=clamp(s.stats.morale-2);
                    addLog('Occasion perdue','Tu préfères rester vivant que tenter l’impossible.','Danger');
                    toast('Retrait','Tu laisses le butin derrière toi.','warning');
                }
            }
        ]
    }
];

function initialState(){
    return {
        day:1,
        timeIndex:0,
        location:'Abri',
        weather:'clear',
        shelter:58,
        noise:18,
        danger:22,
        lastSavedAt:null,
        nightGuard:0,
        deathReason:null,
        statsSummary:{
            explorations:0,
            attacks:0,
            resourcesFound:0
        },
        buildings:{
            rainCollector:{built:false},
            garden:{built:false,lastHarvestDay:1},
            medicalCorner:{built:false},
            bed:{built:false}
        },
        inventory:{
            food:4,
            water:4,
            bandage:2,
            medicine:0,
            ammo:3,
            materials:5,
            fuel:1
        },
        stats:{
            health:84,
            hunger:68,
            thirst:70,
            energy:76,
            morale:61,
            infection:8,
            stress:34
        },
        log:[]
    };
}

let state=initialState();

const statsConfig=[
    {key:'health',label:'Santé',tone:'success'},
    {key:'hunger',label:'Faim',tone:'warning'},
    {key:'thirst',label:'Soif',tone:'warning'},
    {key:'energy',label:'Énergie',tone:'success'},
    {key:'morale',label:'Moral',tone:'success'},
    {key:'infection',label:'Infection',tone:'danger'},
    {key:'stress',label:'Stress',tone:'danger'}
];

const $=id=>document.getElementById(id);

const startScreen=$('startScreen');
const gameApp=$('gameApp');
const continueBtn=$('continueBtn');
const newGameBtn=$('newGameBtn');
const resetSaveBtn=$('resetSaveBtn');
const saveNowBtn=$('saveNowBtn');
const stickyActions=$('stickyActions');

const buildingsToggle=$('buildingsToggle');
const simpleToggle=$('simpleToggle');
const dangerousToggle=$('dangerousToggle');
const journalToggle=$('journalToggle');

const buildingsContent=$('buildingsContent');
const simpleContent=$('simpleContent');
const dangerousContent=$('dangerousContent');
const journalContent=$('journalContent');

const moreActionsBtn=$('moreActionsBtn');
const moreActionsPanel=$('moreActionsPanel');

const stickyVitals=$('stickyVitals');
const stickyResources=$('stickyResources');
const statusSummary=$('statusSummary');
const statsGrid=$('statsGrid');
const statusChips=$('statusChips');
const overviewGrid=$('overviewGrid');
const inventoryList=$('inventoryList');
const journalDays=$('journalDays');
const dayLabel=$('dayLabel');
const timeLabel=$('timeLabel');
const locationLabel=$('locationLabel');
const simpleLocationsGrid=$('simpleLocationsGrid');
const dangerousLocationsGrid=$('dangerousLocationsGrid');
const buildingsGrid=$('buildingsGrid');
const saveStateLabel=$('saveStateLabel');
const weatherLabel=$('weatherLabel');
const ambienceText=$('ambienceText');
const gameOverScreen=$('gameOverScreen');
const gameOverReason=$('gameOverReason');
const gameOverStats=$('gameOverStats');
const restartBtn=$('restartBtn');
const backMenuBtn=$('backMenuBtn');
const eventModal=$('eventModal');
const eventTitle=$('eventTitle');
const eventText=$('eventText');
const eventChoices=$('eventChoices');

document.querySelectorAll('[data-action]').forEach(btn=>{
    btn.addEventListener('click',()=>handleAction(btn.dataset.action));
});

continueBtn.addEventListener('click',continueGame);
newGameBtn.addEventListener('click',startNewGame);
resetSaveBtn.addEventListener('click',resetSave);
saveNowBtn.addEventListener('click',()=>{
    save();
    toast('Sauvegarde','Partie sauvegardée.','success');
});
restartBtn.addEventListener('click',()=>{
    gameOverScreen.classList.add('hidden');
    startNewGame();
});
backMenuBtn.addEventListener('click',()=>{
    gameOverScreen.classList.add('hidden');
    toggleGame(false);
});
moreActionsBtn.addEventListener('click',()=>{
    moreActionsPanel.classList.toggle('hidden');
});

buildingsToggle.addEventListener('click',()=>toggleAccordion(buildingsToggle,buildingsContent));
simpleToggle.addEventListener('click',()=>toggleAccordion(simpleToggle,simpleContent));
dangerousToggle.addEventListener('click',()=>toggleAccordion(dangerousToggle,dangerousContent));
journalToggle.addEventListener('click',()=>toggleAccordion(journalToggle,journalContent));

function toggleAccordion(trigger, content){
    const open=trigger.getAttribute('aria-expanded')==='true';
    trigger.setAttribute('aria-expanded', String(!open));
    content.classList.toggle('hidden', open);
}

function clamp(v,min=0,max=100){
    return Math.max(min,Math.min(max,v));
}

function randomInt(min,max){
    return Math.floor(Math.random()*(max-min+1))+min;
}

function pick(arr){
    return arr[randomInt(0,arr.length-1)];
}

function save(){
    state.lastSavedAt=new Date().toISOString();
    localStorage.setItem(SAVE_KEY,JSON.stringify(state));
    renderSaveLabel();
    continueBtn.disabled=false;
}

function load(){
    const raw=localStorage.getItem(SAVE_KEY);
    if(!raw) return null;
    try{
        return JSON.parse(raw);
    }catch{
        return null;
    }
}

function toggleGame(show){
    startScreen.classList.toggle('hidden',show);
    gameApp.classList.toggle('hidden',!show);
    stickyActions.classList.toggle('hidden',!show);
}

function addLog(title,text,tag='Système'){
    state.log.unshift({
        title,
        text,
        tag,
        time:`Jour ${state.day} • ${timeSlots[state.timeIndex]}`
    });
    state.log=state.log.slice(0,24);
}

function toast(title,message,type='info',duration=2600){
    const c=$('toastContainer');
    const t=document.createElement('div');
    t.className=`toast ${type}`;
    t.innerHTML=`
    <div class="toast-top">
      <div class="toast-title">${title}</div>
      <button class="toast-close">×</button>
    </div>
    <div class="toast-message">${message}</div>
  `;
    const rm=()=>{
        if(!t.isConnected) return;
        t.classList.add('hide');
        setTimeout(()=>{
            if(t.isConnected) t.remove();
        },240);
    };
    t.querySelector('.toast-close').addEventListener('click',rm);
    c.prepend(t);
    setTimeout(rm,duration);
}

function getWeatherLabel(id){
    return weatherDefs.find(x=>x.id===id)?.label || '☀️ Temps clair';
}

function rollWeather(){
    state.weather=pick(weatherDefs).id;
}

function getEnergyState(value=state.stats.energy){
    if(value >= 75) return 'En forme';
    if(value >= 50) return 'Fatigué';
    if(value >= 25) return 'Très fatigué';
    return 'Épuisé';
}

function getStressState(value=state.stats.stress){
    if(value < 25) return 'Calme';
    if(value < 50) return 'Sous tension';
    if(value < 75) return 'Stress élevé';
    return 'Au bord de la panique';
}

function getSleepRecovery(){
    let recovery = state.buildings.bed.built ? randomInt(24,32) : randomInt(16,24);

    if(state.stats.hunger < 25) recovery -= 6;
    if(state.stats.thirst < 25) recovery -= 8;
    if(state.stats.stress > 70) recovery -= 10;
    else if(state.stats.stress > 50) recovery -= 5;
    if(state.stats.infection > 40) recovery -= 8;
    else if(state.stats.infection > 20) recovery -= 4;
    if(state.stats.health < 35) recovery -= 4;

    return Math.max(6, recovery);
}

function canDoDangerousExploration(){
    if(state.stats.energy < 25){
        toast('Trop épuisé','Impossible de lancer une expédition dangereuse avec une énergie aussi basse.','warning');
        return false;
    }
    if(state.stats.stress > 85){
        toast('Panique','Tu es trop stressé pour tenter une expédition dangereuse.','warning');
        return false;
    }
    if(state.stats.health < 20){
        toast('Trop affaibli','Ton état physique ne permet pas une expédition dangereuse.','warning');
        return false;
    }
    return true;
}

function applyLowStateEffects(){
    if(state.stats.energy < 30){
        state.stats.stress = clamp(state.stats.stress + 3);
    }

    if(state.stats.hunger < 25){
        state.stats.stress = clamp(state.stats.stress + 2);
    }

    if(state.stats.thirst < 25){
        state.stats.stress = clamp(state.stats.stress + 3);
    }

    if(state.stats.infection > 35){
        state.stats.stress = clamp(state.stats.stress + 2);
        state.stats.energy = clamp(state.stats.energy - 2);
    }

    if(state.stats.stress > 70){
        state.stats.energy = clamp(state.stats.energy - 2);
    }

    if(state.stats.stress > 85){
        state.stats.morale = clamp(state.stats.morale - 3);
    }
}

function getExplorationEnergyCost(mode){
    let min = mode === 'dangerous' ? 14 : 10;
    let max = mode === 'dangerous' ? 22 : 16;

    if(state.stats.energy < 40){
        min += 3;
        max += 5;
    }

    if(state.stats.stress > 60){
        min += 2;
        max += 4;
    }

    return randomInt(min, max);
}

function getExplorationStressGain(mode){
    let min = mode === 'dangerous' ? 6 : 2;
    let max = mode === 'dangerous' ? 12 : 6;

    if(state.stats.energy < 35){
        min += 2;
        max += 4;
    }

    if(state.stats.infection > 25){
        min += 1;
        max += 3;
    }

    return randomInt(min, max);
}

function getStatusSummary(){
    if(state.shelter<=15) return 'Abri critique';
    if(state.stats.health<=25) return 'État critique';
    if(state.stats.infection>=50) return 'Infection préoccupante';
    if(state.stats.thirst<=25) return 'Déshydratation imminente';
    if(state.stats.hunger<=25) return 'Famine en approche';
    if(state.stats.stress>=85) return 'Au bord de la panique';
    if(state.stats.stress>=65) return 'Stress très élevé';
    if(state.stats.energy<=20) return 'Épuisement sévère';
    return 'Situation stable';
}

function startNewGame(){
    state=initialState();
    addLog('Début de survie','Tu verrouilles l’abri. Les premières sorties décideront de tout.','Prologue');
    toggleGame(true);
    save();
    render();
    toast('Nouvelle partie','La V6.1 démarre.','success');
}

function continueGame(){
    const saved=load();
    if(!saved){
        toast('Aucune sauvegarde','Commence une nouvelle partie.','warning');
        return;
    }
    state=saved;
    toggleGame(true);
    render();
    toast('Continuer','Sauvegarde chargée.','info');
}

function resetSave(){
    localStorage.removeItem(SAVE_KEY);
    continueBtn.disabled=true;
    toast('Sauvegarde effacée','La progression enregistrée a été supprimée.','warning');
}

function payCost(cost){
    for(const [k,v] of Object.entries(cost)){
        if((state.inventory[k]||0)<v) return false;
    }
    for(const [k,v] of Object.entries(cost)){
        state.inventory[k]-=v;
    }
    return true;
}

function buildStructure(id){
    const def=buildingDefs.find(b=>b.id===id);
    if(!def) return;

    if(state.buildings[id].built){
        toast('Déjà construit','Cette amélioration est déjà en place.','info');
        return;
    }

    if(!payCost(def.cost)){
        toast('Ressources insuffisantes','Tu n’as pas ce qu’il faut pour construire ça.','warning');
        return;
    }

    state.buildings[id].built=true;
    if(id==='garden') state.buildings[id].lastHarvestDay=state.day;

    addLog('Construction',`${def.name} installé dans l’abri.`,'Abri');
    toast('Construction terminée',def.name,'success');
    save();
    render();
}

function applyPassiveProduction(){
    if(state.buildings.rainCollector.built && state.weather==='rain'){
        const gain=randomInt(1,3);
        state.inventory.water+=gain;
        state.statsSummary.resourcesFound+=gain;
        addLog('Récupération d’eau',`Le récupérateur d’eau te fournit ${gain} bouteille(s).`,'Abri');
        toast('Pluie utile',`+${gain} eau grâce au récupérateur.`,'success');
    }

    if(state.buildings.garden.built && state.day-state.buildings.garden.lastHarvestDay>=3){
        const gain=randomInt(2,4);
        state.inventory.food+=gain;
        state.statsSummary.resourcesFound+=gain;
        state.buildings.garden.lastHarvestDay=state.day;
        addLog('Récolte',`Le potager fournit ${gain} ration(s).`,'Abri');
        toast('Potager',`+${gain} nourriture récoltée.`,'success');
    }
}

function advanceTime(){
    state.timeIndex+=1;

    state.stats.hunger=clamp(state.stats.hunger-randomInt(5,9));
    state.stats.thirst=clamp(state.stats.thirst-randomInt(6,10));
    state.stats.energy=clamp(state.stats.energy-randomInt(4,7));
    state.stats.morale=clamp(state.stats.morale-randomInt(1,3));
    state.stats.stress=clamp(state.stats.stress+randomInt(1,3));
    state.noise=clamp(state.noise-randomInt(1,3));
    state.danger=clamp(state.danger+randomInt(1,4));

    applyLowStateEffects();

    if(state.stats.hunger<25) state.stats.health=clamp(state.stats.health-4);
    if(state.stats.thirst<25) state.stats.health=clamp(state.stats.health-6);
    if(state.stats.energy<20) state.stats.health=clamp(state.stats.health-3);
    if(state.stats.infection>40) state.stats.health=clamp(state.stats.health-5);

    if(state.timeIndex>3){
        state.timeIndex=0;
        state.day+=1;
        state.location='Abri';
        rollWeather();
        applyPassiveProduction();
        nightEvent();
    }

    checkDeath();
}

function nightEvent(){
    let attackRisk=state.danger+state.noise-Math.floor(state.shelter/2)-state.nightGuard;
    state.nightGuard=0;

    if(attackRisk>60){
        const dmg=randomInt(6,14);
        const shelterDmg=randomInt(8,16);
        const stressGain=randomInt(10,18);

        state.stats.health=clamp(state.stats.health-dmg);
        state.shelter=Math.max(0,state.shelter-shelterDmg);
        state.stats.stress=clamp(state.stats.stress+stressGain);
        state.statsSummary.attacks+=1;

        addLog('Attaque nocturne',`Des rôdeurs frappent l’abri pendant la nuit. Santé -${dmg}, protection -${shelterDmg}, stress +${stressGain}.`,'Nuit');
        toast('Attaque nocturne',`Santé -${dmg}. Abri -${shelterDmg}. Stress +${stressGain}.`,'danger');
    }else{
        const energyGain = state.stats.stress > 70 ? 4 : 8;
        const stressDrop = randomInt(2,5);

        state.stats.energy=clamp(state.stats.energy+energyGain);
        state.stats.stress=clamp(state.stats.stress-stressDrop);

        addLog('Nuit calme','La nuit reste tendue mais silencieuse. L’abri tient bon.','Nuit');
        toast('Nuit calme',`Énergie +${energyGain}, stress -${stressDrop}.`,'success');
    }

    checkDeath();
}

function checkDeath(){
    if(state.shelter<=0){
        showGameOver("l'abri a cédé");
        return;
    }

    if(state.stats.health>0) return;

    const reason=
        state.stats.infection>=75 ? 'infection avancée' :
            state.stats.thirst<=0 ? 'déshydratation' :
                state.stats.hunger<=0 ? 'famine' :
                    'blessures trop graves';

    showGameOver(reason);
}

function handleAction(action){
    if(!moreActionsPanel.classList.contains('hidden')){
        moreActionsPanel.classList.add('hidden');
    }

    switch(action){
        case 'sleep': {
            state.location='Abri';
            const recovery = getSleepRecovery();
            state.stats.energy=clamp(state.stats.energy+recovery);

            if(state.stats.stress > 70){
                state.stats.stress=clamp(state.stats.stress-randomInt(3,6));
            }else{
                state.stats.stress=clamp(state.stats.stress-randomInt(5,9));
            }

            addLog('Repos',`Tu dors quelques heures. Récupération d’énergie : +${recovery}.`,'Abri');
            toast('Sommeil',`Énergie +${recovery}. (${getEnergyState(state.stats.energy)})`,'info');
            advanceTime();
            break;
        }

        case 'eat':
            if(state.inventory.food<=0){
                toast('Famine','Aucune ration disponible.','warning');
                return;
            }
            state.inventory.food-=1;
            state.stats.hunger=clamp(state.stats.hunger+24);
            if(state.stats.hunger > 50){
                state.stats.stress=clamp(state.stats.stress-2);
            }
            toast('Repas','1 ration consommée.','success');
            break;

        case 'drink':
            if(state.inventory.water<=0){
                toast('Déshydratation','Aucune eau disponible.','warning');
                return;
            }
            state.inventory.water-=1;
            state.stats.thirst=clamp(state.stats.thirst+24);
            if(state.stats.thirst > 50){
                state.stats.stress=clamp(state.stats.stress-2);
            }
            toast('Hydratation','1 eau consommée.','success');
            break;

        case 'heal':
            if(state.inventory.bandage<=0){
                toast('Soin impossible','Aucun bandage disponible.','warning');
                return;
            }
            state.inventory.bandage-=1;
            state.stats.health=clamp(state.stats.health+(state.buildings.medicalCorner.built?20:14));
            state.stats.infection=clamp(state.stats.infection-8);
            state.stats.stress=clamp(state.stats.stress-2);
            toast('Soins','Tu te remets partiellement sur pied.','success');
            break;

        case 'fortify':
            if((state.inventory.materials||0)<2){
                toast('Abri','Pas assez de matériaux.','warning');
                return;
            }
            if(state.stats.energy < 15){
                toast('Trop fatigué','Tu es trop épuisé pour renforcer l’abri maintenant.','warning');
                return;
            }
            state.inventory.materials-=2;
            state.shelter=clamp(state.shelter+14);
            state.stats.energy=clamp(state.stats.energy-randomInt(6,10));
            state.stats.stress=clamp(state.stats.stress-randomInt(2,5));
            toast('Protection','L’abri est renforcé.','success');
            advanceTime();
            break;

        case 'night-watch':
            state.nightGuard=clamp(state.nightGuard+18,0,40);
            state.stats.energy=clamp(state.stats.energy-8);
            state.stats.stress=clamp(state.stats.stress+4);
            toast('Veille préparée','Le risque nocturne baisse, mais la fatigue augmente.','success');
            advanceTime();
            break;

        case 'relax':
            state.stats.stress=clamp(state.stats.stress-randomInt(10,18));
            state.stats.morale=clamp(state.stats.morale+randomInt(3,6));
            state.stats.energy=clamp(state.stats.energy+2);
            addLog('Moment de calme','Tu prends quelques minutes pour souffler et laisser la tension redescendre.','Mental');
            toast('Se détendre',`Stress : ${getStressState(state.stats.stress)}.`,'success');
            advanceTime();
            break;

        case 'patrol':
            if(state.stats.energy < 18){
                toast('Trop fatigué','Tu es trop fatigué pour patrouiller autour de l’abri.','warning');
                return;
            }
        {
            const reduction = randomInt(6,10);
            const energyCost = randomInt(8,12);
            const stressGain = randomInt(2,5);

            state.danger = clamp(state.danger - reduction);
            state.stats.energy = clamp(state.stats.energy - energyCost);
            state.stats.stress = clamp(state.stats.stress + stressGain);

            addLog('Patrouille',`Tu inspectes les abords de l’abri. Danger extérieur -${reduction}, énergie -${energyCost}, stress +${stressGain}.`,'Abri');
            toast('Patrouille',`Danger extérieur -${reduction}.`,'success');
            advanceTime();
        }
            break;

        case 'secure-zone':
            if((state.inventory.materials||0) < 3){
                toast('Matériaux insuffisants','Il faut 3 matériaux pour sécuriser le périmètre.','warning');
                return;
            }
            if(state.stats.energy < 20){
                toast('Trop fatigué','Tu es trop fatigué pour sécuriser le périmètre.','warning');
                return;
            }
        {
            const reduction = randomInt(8,14);
            const shelterGain = randomInt(15,20);
            const energyCost = randomInt(8,12);

            state.inventory.materials -= 3;
            state.danger = clamp(state.danger - reduction);
            state.shelter = clamp(state.shelter + shelterGain);
            state.stats.energy = clamp(state.stats.energy - energyCost);
            state.stats.stress = clamp(state.stats.stress - randomInt(1,3));

            addLog('Sécurisation',`Tu renforces les abords de l’abri. Danger extérieur -${reduction}, protection +${shelterGain}.`,'Abri');
            toast('Périmètre sécurisé',`Danger -${reduction}, abri +${shelterGain}.`,'success');
            advanceTime();
        }
            break;

        case 'clear-threat':
            if((state.inventory.ammo||0) < 2){
                toast('Munitions insuffisantes','Il faut 2 munitions pour une élimination ciblée.','warning');
                return;
            }
            if(state.stats.energy < 22){
                toast('Trop fatigué','Tu es trop fatigué pour sortir neutraliser une menace.','warning');
                return;
            }
        {
            const reduction = randomInt(10,18);
            const noiseGain = randomInt(5,10);
            const energyCost = randomInt(10,14);
            const stressGain = randomInt(3,6);

            state.inventory.ammo -= 2;
            state.danger = clamp(state.danger - reduction);
            state.noise = clamp(state.noise + noiseGain);
            state.stats.energy = clamp(state.stats.energy - energyCost);
            state.stats.stress = clamp(state.stats.stress + stressGain);

            addLog('Élimination ciblée',`Tu neutralises une menace près de l’abri. Danger extérieur -${reduction}, bruit +${noiseGain}.`,'Combat');
            toast('Menace réduite',`Danger -${reduction}, mais bruit +${noiseGain}.`,'warning');
            advanceTime();
        }
            break;

        case 'next':
            addLog('Temps qui passe','Tu laisses filer quelques heures dans l’abri.','Temps');
            toast('Temps','Quelques heures passent.','info');
            advanceTime();
            break;
    }

    save();
    render();
}

function runExploration(loc, mode){
    state.location=loc.name;
    state.statsSummary.explorations+=1;

    const rewards={};
    Object.entries(loc.rewards).forEach(([k,[min,max]])=>{
        rewards[k]=randomInt(min,max);
    });

    Object.entries(rewards).forEach(([k,v])=>{
        state.inventory[k]=(state.inventory[k]||0)+v;
        state.statsSummary.resourcesFound+=v;
    });

    const energyCost = getExplorationEnergyCost(mode);
    const stressGain = getExplorationStressGain(mode);

    state.stats.energy=clamp(state.stats.energy-energyCost);
    state.stats.thirst=clamp(state.stats.thirst-randomInt(mode==='dangerous'?10:8,mode==='dangerous'?16:12));
    state.stats.hunger=clamp(state.stats.hunger-randomInt(mode==='dangerous'?8:5,mode==='dangerous'?12:8));
    state.stats.stress=clamp(state.stats.stress+stressGain);
    state.noise=clamp(state.noise+randomInt(mode==='dangerous'?10:6,mode==='dangerous'?18:14));
    state.danger=clamp(state.danger+randomInt(mode==='dangerous'?8:4,mode==='dangerous'?14:10));

    addLog(
        mode==='dangerous' ? 'Expédition dangereuse' : 'Exploration',
        `Tu fouilles ${loc.name} et récupères ${formatRewardText(rewards)}. Énergie -${energyCost}, stress +${stressGain}.`,
        mode==='dangerous' ? 'Expédition' : 'Exploration'
    );

    toast(loc.name,`Butin : ${formatRewardText(rewards)}.`,'success');

    if(Math.random()<(mode==='dangerous'?0.72:0.45)){
        openEvent(pick(mode==='dangerous'?dangerousEvents:simpleEvents));
    }

    advanceTime();
    save();
    render();
}

function exploreSimple(id){
    const loc=simpleLocations.find(l=>l.id===id);
    if(!loc) return;

    if(state.stats.energy < 10){
        toast('Trop épuisé','Tu n’as même plus la force pour une sortie simple.','warning');
        return;
    }

    runExploration(loc,'simple');
}

function exploreDangerous(id){
    const loc=dangerousLocations.find(l=>l.id===id);
    if(!loc) return;

    if(!canDoDangerousExploration()) return;

    if(!payCost(loc.cost)){
        toast('Expédition impossible',costText(loc.cost)+' requis.','warning');
        return;
    }

    addLog('Préparation expédition',`Tu dépenses ${costText(loc.cost)} pour sécuriser la sortie vers ${loc.name}.`,'Expédition');
    runExploration(loc,'dangerous');
}

function openEvent(ev){
    eventTitle.textContent=ev.title;
    eventText.textContent=ev.text;
    eventChoices.innerHTML='';

    ev.choices.forEach(choice=>{
        const b=document.createElement('button');
        b.className='btn';
        b.innerHTML=`<strong>${choice.label}</strong><span>${choice.desc}</span>`;
        b.addEventListener('click',()=>{
            choice.effect(state);
            eventModal.classList.add('hidden');
            save();
            render();
        });
        eventChoices.appendChild(b);
    });

    eventModal.classList.remove('hidden');
}

function costText(cost){
    return Object.entries(cost)
        .map(([k,v])=>`${v} ${k==='ammo'?'munition'+(v>1?'s':''):k==='fuel'?'carburant':k}`)
        .join(' + ');
}

function formatRewardText(rewards){
    const labels={
        food:'ration',
        water:'eau',
        bandage:'bandage',
        medicine:'médicament',
        ammo:'munition',
        materials:'matériau',
        fuel:'carburant'
    };

    return Object.entries(rewards)
        .filter(([,v])=>v>0)
        .map(([k,v])=>`${v} ${labels[k]||k}${v>1&&k==='materials'?'x':''}`)
        .join(', ')
        .replace(/([0-9]+) matériau x/g,'$1 matériaux')
        .replace(/1 matériau x/g,'1 matériau') || 'rien d’utile';
}

function renderSaveLabel(){
    if(!state.lastSavedAt){
        saveStateLabel.textContent='Aucune sauvegarde';
        return;
    }

    const d=new Date(state.lastSavedAt);
    saveStateLabel.textContent=`Sauvegardé à ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

function showGameOver(reason){
    state.deathReason=reason;
    gameOverReason.textContent=`Tu as survécu ${state.day} jour(s). Cause de la mort : ${reason}.`;

    gameOverStats.innerHTML=[
        {label:'Jours survécus',value:state.day},
        {label:'Explorations',value:state.statsSummary.explorations},
        {label:'Ressources trouvées',value:state.statsSummary.resourcesFound},
        {label:'Attaques nocturnes',value:state.statsSummary.attacks},
        {label:'Abri final',value:`${state.shelter}%`},
        {label:'Météo finale',value:getWeatherLabel(state.weather)}
    ].map(item=>`
    <article class="game-over-stat">
      <span>${item.label}</span>
      <strong>${item.value}</strong>
    </article>
  `).join('');

    gameOverScreen.classList.remove('hidden');
}

function getChips(){
    const c=[];

    if(state.stats.health<=35) c.push({text:'Blessé',type:'alert'});
    if(state.stats.infection>=35) c.push({text:'Infection',type:'alert'});
    if(state.stats.stress>=75) c.push({text:'Panique proche',type:'alert'});
    else if(state.stats.stress>=55) c.push({text:'Stress élevé',type:'alert'});

    if(state.stats.energy<=25) c.push({text:'Épuisé',type:'alert'});
    else if(state.stats.energy<=45) c.push({text:'Très fatigué',type:'alert'});

    if(state.shelter>=70) c.push({text:'Abri solide',type:'good'});
    if(state.inventory.water>=4) c.push({text:'Eau suffisante',type:'good'});
    if(state.buildings.rainCollector.built) c.push({text:'Collecteur actif',type:'good'});
    if(state.buildings.garden.built) c.push({text:'Potager',type:'good'});

    c.push({text:`Énergie : ${getEnergyState()}`,type:''});
    c.push({text:`Stress : ${getStressState()}`,type:''});

    return c;
}

function getAmbienceText(){
    const time=timeSlots[state.timeIndex];
    const weather=getWeatherLabel(state.weather).replace(/^.. /,'').toLowerCase();

    if(state.stats.stress>=80){
        return `Tu sursautes au moindre bruit. ${time} sous ${weather}, et tes nerfs sont presque à bout.`;
    }
    if(state.stats.energy<=25){
        return `Ton corps commence à lâcher. ${time}, mais chaque geste te coûte un effort énorme.`;
    }
    if(state.stats.hunger<=25){
        return `Ton ventre te serre. ${time} dans l’abri, mais sortir sans manger serait risqué.`;
    }
    if(time==='Nuit'){
        return `La nuit étouffe les sons puis les amplifie soudainement. Le moindre choc dehors semble tout proche.`;
    }
    if(state.weather==='rain'){
        return `La pluie tambourine sur le toit. Pour une fois, le mauvais temps peut t’aider à récupérer de l’eau.`;
    }
    if(state.weather==='fog'){
        return `Le brouillard avale les silhouettes. Dehors, tout paraît plus lent et plus inquiétant.`;
    }
    if(state.weather==='cold'){
        return `Le froid sec vide doucement tes forces. Même dans l’abri, l’air reste mordant.`;
    }

    return `Le quartier paraît presque vide, mais ce calme n’est jamais rassurant. ${time} sous ${weather}.`;
}

function renderSticky(){
    stickyVitals.innerHTML=[
        ['❤️','Santé',state.stats.health],
        ['🍖','Faim',state.stats.hunger],
        ['💧','Soif',state.stats.thirst],
        ['⚡','Énergie',state.stats.energy]
    ].map(([i,l,v])=>`
    <div class="sticky-pill">
      <span class="icon">${i}</span>
      <div>
        <strong>${v}%</strong>
        <span>${l}</span>
      </div>
    </div>
  `).join('');

    stickyResources.innerHTML=[
        ['food','Nourriture',state.inventory.food],
        ['water','Eau',state.inventory.water],
        ['materials','Matériaux',state.inventory.materials],
        ['bandage','Bandages',state.inventory.bandage],
        ['ammo','Munitions',state.inventory.ammo],
        ['fuel','Carburant',state.inventory.fuel]
    ].map(([k,l,v])=>`
    <div class="sticky-pill">
      <span class="icon">${icons[k]}</span>
      <div>
        <strong>${v}</strong>
        <span>${l}</span>
      </div>
    </div>
  `).join('');

    statusSummary.textContent=getStatusSummary();
}

function renderStats(){
    statsGrid.innerHTML='';

    statsConfig.forEach(item=>{
        const value=clamp(state.stats[item.key]);
        const card=document.createElement('article');
        card.className='stat';

        const fill=document.createElement('div');
        fill.className=`bar-fill ${item.tone}`;
        fill.style.width=`${value}%`;

        card.innerHTML=`
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

function renderChips(){
    statusChips.innerHTML='';

    getChips().forEach(ch=>{
        const el=document.createElement('div');
        el.className=`chip ${ch.type||''}`.trim();
        el.textContent=ch.text;
        statusChips.appendChild(el);
    });
}

function renderOverview(){
    overviewGrid.innerHTML=[
        {label:'Protection abri',value:`${state.shelter}%`},
        {label:'Niveau de bruit',value:`${state.noise}%`},
        {label:'Danger extérieur',value:`${state.danger}%`},
        {label:'Lieu actuel',value:state.location}
    ].map(i=>`
    <article class="info">
      <span>${i.label}</span>
      <strong>${i.value}</strong>
    </article>
  `).join('');
}

function renderBuildings(){
    buildingsGrid.innerHTML=buildingDefs.map(def=>{
        const built=state.buildings[def.id].built;

        const costTextLocal=Object.entries(def.cost).map(([k,v])=>
            `${icons[k]||''} ${v} ${
                k==='materials'?'matériaux':
                    k==='food'?'nourriture':
                        k==='water'?'eau':
                            k==='medicine'?'médicaments':k
            }`
        ).join(', ');

        return `
      <article class="building-card">
        <div class="building-top">
          <strong>${def.name}</strong>
          <span class="badge ${built?'good':'loot'}">${built?'Construit':'À construire'}</span>
        </div>
        <p class="modal-text">${def.desc}</p>
        <div class="location-meta">
          <span class="badge">${costTextLocal}</span>
        </div>
        <button class="btn ${built?'':'primary'} build-btn" data-building="${def.id}" ${built?'disabled':''}>
          <strong>${built?'Déjà installé':'Construire'}</strong>
          <span>${built?'Amélioration active dans l’abri':'Lancer la construction'}</span>
        </button>
      </article>
    `;
    }).join('');

    document.querySelectorAll('.build-btn').forEach(btn=>{
        btn.addEventListener('click',()=>buildStructure(btn.dataset.building));
    });
}

function renderSimpleLocations(){
    simpleLocationsGrid.innerHTML=simpleLocations.map(loc=>`
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

    document.querySelectorAll('.simple-explore-btn').forEach(btn=>{
        btn.addEventListener('click',()=>exploreSimple(btn.dataset.location));
    });
}

function renderDangerousLocations(){
    dangerousLocationsGrid.innerHTML=dangerousLocations.map(loc=>`
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

    document.querySelectorAll('.dangerous-explore-btn').forEach(btn=>{
        btn.addEventListener('click',()=>exploreDangerous(btn.dataset.location));
    });
}

function renderInventory(){
    const labels={
        food:['Nourriture','Rations et conserves'],
        water:['Eau','Bouteilles récupérées'],
        bandage:['Bandages','Soins d’urgence'],
        medicine:['Médicaments','Antiseptiques et antibiotiques'],
        ammo:['Munitions','Derniers chargeurs'],
        materials:['Matériaux','Planches, métal, outils'],
        fuel:['Carburant','Réserves rares']
    };

    inventoryList.innerHTML=Object.entries(state.inventory).map(([k,v])=>{
        const [l,d]=labels[k]||[k,'Ressource'];

        return `
      <article class="loot-row">
        <div>
          <span class="icon">${icons[k]||'📦'}</span>
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

function renderJournal(){
    const groups={};

    state.log.forEach(entry=>{
        const m=entry.time.match(/Jour\\s+(\\d+)/);
        const day=m?m[1]:'?';
        (groups[day]||(groups[day]=[])).push(entry);
    });

    const days=Object.keys(groups).sort((a,b)=>Number(b)-Number(a));

    journalDays.innerHTML=days.map(day=>`
    <section class="journal-day">
      <h3>Jour ${day}</h3>
      <div class="journal-entries">
        ${groups[day].map(e=>`
          <article class="entry">
            <div class="entry-meta">
              <span>${e.tag}</span>
              <span>${e.time.replace(/^Jour\\s+\\d+\\s+•\\s+/,'')}</span>
            </div>
            <strong>${e.title}</strong>
            <p>${e.text}</p>
          </article>
        `).join('')}
      </div>
    </section>
  `).join('');
}

function renderHeader(){
    dayLabel.textContent=state.day;
    timeLabel.textContent=timeSlots[state.timeIndex];
    locationLabel.textContent=state.location;
    renderSaveLabel();
    weatherLabel.textContent=getWeatherLabel(state.weather);
    ambienceText.textContent=getAmbienceText();
}

function render(){
    renderHeader();
    renderSticky();
    renderStats();
    renderChips();
    renderOverview();
    renderBuildings();
    renderSimpleLocations();
    renderDangerousLocations();
    renderInventory();
    renderJournal();
}

(function init(){
    const saved=load();
    continueBtn.disabled=!saved;
    if(saved) state=saved;
})();
