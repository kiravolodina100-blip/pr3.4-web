const logs = [
    '[ПЕРСОНАЖ №1] згадав щось важливе, але несподівано [ПЕРСОНАЖ №2], не тямлячи себе від переляку, вдарив у передпліччя ворога.',
    '[ПЕРСОНАЖ №1] поперхнулся, и за это [ПЕРСОНАЖ №2] с испугу приложил прямой удар коленом в лоб врага.',
    '[ПЕРСОНАЖ №1] забылся, но в это время наглый [ПЕРСОНАЖ №2], приняв волевое решение, неслышно подойдя сзади, ударил.',
    '[ПЕРСОНАЖ №1] пришел в себя, но неожиданно [ПЕРСОНАЖ №2] случайно нанес мощнейший удар.',
    '[ПЕРСОНАЖ №1] поперхнулся, но в это время [ПЕРСОНАЖ №2] нехотя раздробил кулаком <вырезанно цензурой> противника.',
    '[ПЕРСОНАЖ №1] удивился, а [ПЕРСОНАЖ №2] пошатнувшись влепил подлый удар.',
    '[ПЕРСОНАЖ №1] высморкался, но неожиданно [ПЕРСОНАЖ №2] провел дробящий удар.',
    '[ПЕРСОНАЖ №1] пошатнулся, и внезапно наглый [ПЕРСОНАЖ №2] беспричинно ударил в ногу противника',
    '[ПЕРСОНАЖ №1] расстроился, как вдруг, неожиданно [ПЕРСОНАЖ №2] случайно влепил стопой в живот соперника.',
    '[ПЕРСОНАЖ №1] пытался что-то сказать, но вдруг, неожиданно [ПЕРСОНАЖ №2] со скуки, разбил бровь сопернику.'
];

function random(num) {
    return Math.floor(Math.random() * (num + 1));
}

function countClicks(maxLimit = 6) {
    let clicks = 0;

    return function(buttonElement, buttonOriginalText) {
        clicks++;
        const remaining = maxLimit - clicks;
        
        console.log(`Кількість кліків по кнопці: ${clicks}. Залишилось натискань: ${remaining >= 0 ? remaining : 0}`);

        if (remaining >= 0) {
            buttonElement.innerText = `${buttonOriginalText} (${remaining})`;
        }

        if (clicks >= maxLimit) {
            buttonElement.disabled = true;
            buttonElement.innerText = `${buttonOriginalText} (Вичерпано)`;
            console.log('Ліміт натискань для цієї кнопки вичерпано!');
        }

        return clicks;
    };
}

const countKickClicks = countClicks(6);
const countSuperKickClicks = countClicks(6);

function renderHPLife() {
    const { elHP, damageHP, defaultHP } = this;
    elHP.innerText = `${damageHP} / ${defaultHP}`;
}

function renderProgressbar() {
    const { damageHP, defaultHP, elProgressbar } = this;
    const percent = (damageHP * 100) / defaultHP;
    elProgressbar.style.width = percent + '%';
    
    const elBar = elProgressbar;
    elBar.classList.remove('low', 'critical');
    if (percent < 20) {
        elBar.classList.add('critical');
    } else if (percent < 50) {
        elBar.classList.add('low');
    }
}

function render() {
    this.renderHPLife();
    this.renderProgressbar();
}

const character = {
    name: 'Pikachu',
    defaultHP: 100,
    damageHP: 100,
    elHP: document.getElementById('health-character'),
    elProgressbar: document.getElementById('progressbar-character'),
    renderHPLife,
    renderProgressbar,
    render
};

const enemy1 = {
    name: 'Charmander',
    defaultHP: 100,
    damageHP: 100,
    elHP: document.getElementById('health-enemy'),
    elProgressbar: document.getElementById('progressbar-enemy'),
    renderHPLife,
    renderProgressbar,
    render
};

const enemy2 = {
    name: 'Bulbasaur',
    defaultHP: 120,
    damageHP: 120,
    elHP: document.getElementById('health-enemy'),
    elProgressbar: document.getElementById('progressbar-enemy'),
    renderHPLife,
    renderProgressbar,
    render
};

let currentEnemy = enemy1; 

const $btnKick = document.getElementById('btn-kick');
const $btnSuperKick = document.getElementById('btn-super-kick');

function generateLog(first, second, damage) {
    const { name: name1 } = first;
    const { name: name2, damageHP, defaultHP } = second;

    const randomIndex = random(logs.length - 1);
    let text = logs[randomIndex]
        .replace('[ПЕРСОНАЖ №1]', name1)
        .replace('[ПЕРСОНАЖ №2]', name2);

    const logMessage = `${text} -${damage} [${damageHP}/${defaultHP}]`;

    const $p = document.createElement('p');$p.innerText = logMessage;
    
    const $logs = document.getElementById('logs');$logs.insertBefore($p,$logs.children[0]);
}

function attack(attacker, receiver, minDamage, maxDamage) {
    const damage = random(maxDamage - minDamage) + minDamage;
    receiver.damageHP -= damage;

    if (receiver.damageHP <= 0) {
        receiver.damageHP = 0;
        alert(`${receiver.name} програв бій!`);
        $btnKick.disabled = true;
        if ($btnSuperKick)$btnSuperKick.disabled = true;
    }

    receiver.render();
    generateLog(attacker, receiver, damage);
}

$btnKick.addEventListener('click', function () {
    countKickClicks(this, 'Thunder Jolt');
    
    attack(character, currentEnemy, 0, 15);
    
    if (currentEnemy.damageHP > 0) {
        attack(currentEnemy, character, 0, 15);
    }
});

if ($btnSuperKick) {$btnSuperKick.addEventListener('click', function () {
        countSuperKickClicks(this, 'Iron Tail');
        
        attack(character, currentEnemy, 10, 30);
        
        if (currentEnemy.damageHP > 0) {
            attack(currentEnemy, character, 5, 20);
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    character.render();
    currentEnemy.render();
});