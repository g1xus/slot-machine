
const icon_height = 78,
    num_icons = 9,
    time_per_icon = 100,
    indexes = [0, 0, 0];

const roll = (reel, offset = 0) => {
    const delta = (offset + 2) * num_icons + Math.round(Math.random() * num_icons);

    return new Promise((resolve, reject) => {

        const style = getComputedStyle(reel),
            backgroundPositionY = parseFloat(style["background-position-y"]),

            targetBackgroundPositionY = backgroundPositionY + delta * icon_height,

            normTargetBackgroundPositionY = targetBackgroundPositionY%(num_icons * icon_height);
        console.log(backgroundPositionY)
        console.log(targetBackgroundPositionY)
        console.log(normTargetBackgroundPositionY)
        setTimeout(() => {
            reel.style.transition = `all ${(8 + 1 * delta) * time_per_icon}ms cubic-bezier(.41,-0.01,.63,1.09)`;

            reel.style.backgroundPositionY = `${backgroundPositionY + delta * icon_height}px`;
        }, offset * 150);

        // After animation
        setTimeout(() => {
            reel.style.transition = `none`;
            reel.style.backgroundPositionY = `${normTargetBackgroundPositionY}px`;

            resolve(delta%num_icons);
        }, (8 + 1 * delta) * time_per_icon + offset * 150);

    });
};


let balance = 1000000
let score = 0
let bet = 50000
let isAuto = false

let balanceEl = document.getElementById('balance')
let scoreEl = document.getElementById('score')
let betEl = document.getElementById('bet')
let decreaseBetEl = document.getElementById('decreaseBet')
let increaseBetEl = document.getElementById('increaseBet')
let spinEl = document.getElementById('spin')
let autoEl = document.getElementById('auto')
let winTextEl = document.getElementById('winText')
let winValueEl = document.getElementById('winValue')

balanceEl.textContent = balance
scoreEl.textContent = `${score}/9000`
betEl.textContent = bet

decreaseBetEl.addEventListener(("click"), (e) => {
    if(bet - 10000 >= 0) {
        bet -= 10000
        betEl.textContent = bet
    }
})
increaseBetEl.addEventListener(("click"), (e) => {
    bet += 10000
    betEl.textContent = bet
})

function rollAll() {

    if(score < 9000) {
        score += 100
        scoreEl.textContent = `${score}/9000`
    }
    balance -= bet
    balanceEl.textContent = balance

    winTextEl.style.opacity = '0'
    winValueEl.style.opacity = '0'

    const reelsList = document.querySelectorAll('.slots > .reel');

    Promise

        .all( [...reelsList].map((reel, i) => roll(reel, i)) )

        .then((deltas) => {

            deltas.forEach((delta, i) => indexes[i] = (indexes[i] + delta)%num_icons);

            if (indexes[0] == indexes[1] && indexes[1] == indexes[2]) {
                balance += bet * 3
                balanceEl.textContent = balance
                winTextEl.style.opacity = '1'
                winValueEl.style.opacity = '1'
                winValueEl.textContent = bet * 3
            }

            if(isAuto) {
                setTimeout(rollAll, 3000);
            }
        });
};

spinEl.addEventListener(("click"), (e) => {
    if(balance - bet >= 0) {
        rollAll()
    }
})
autoEl.addEventListener(("click"), (e) => {
    if(!isAuto) {
        if(balance - bet >= 0) {
            autoEl.classList.add('controls-buttons__auto_active')
            isAuto = true
            rollAll()
        }
    } else {
        autoEl.classList.remove('controls-buttons__auto_active')
        isAuto = false
    }
})

