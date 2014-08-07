var base = this;

var playingAsOgres = false;

var ENEMY_WORKER = 'peon';
var ENEMY_ZERGLING = 'munchkin';
var ENEMY_STALKER = 'ogre';
var ENEMY_VOID_RAY = 'fangrider';
var ENEMY_HIGH_TEMPLAR = 'shaman';
var ENEMY_CARRIER = 'brawler';

var WORKER = 'peasant';
var ZERGLING = 'soldier';
var STALKER = 'knight';
var VOID_RAY = 'griffin-rider';
var HIGH_TEMPLAR = 'librarian';
var CARRIER = 'captain';

if (playingAsOgres) {
    WORKER = 'peon';
    ZERGLING = 'munchkin';
    STALKER = 'ogre';
    VOID_RAY = 'fangrider';
    HIGH_TEMPLAR = 'shaman';
    CARRIER = 'brawler';

    ENEMY_WORKER = 'peasant';
    ENEMY_ZERGLING = 'soldier';
    ENEMY_STALKER = 'knight';
    ENEMY_VOID_RAY = 'griffin-rider';
    ENEMY_HIGH_TEMPLAR = 'librarian';
    ENEMY_CARRIER = 'captain';
}

var items = base.getItems();
var peons = base.getByType(WORKER);
var ogres = base.getByType(STALKER);
var munchkins = base.getByType(ZERGLING);
var shamans = base.getByType(HIGH_TEMPLAR);

var minPossible = 9999;
var minIndex = 0;
var calc = 0;

for (var peonIndex = 0; peonIndex < peons.length; peonIndex++) {
    for (var itemIndex = 0; itemIndex < items.length; itemIndex++) {
        if (items[itemIndex].bountyGold > 0) {
            calc = (peons[peonIndex].distance(items[itemIndex])) / items[itemIndex].bountyGold;

            if (calc < minPossible) {
                minPossible = calc;
                minIndex = itemIndex;
            }
        }
    }
    var currentPeon = peons[peonIndex];
    base.command(currentPeon, 'move', items[minIndex].pos);

    items.splice(minIndex, 1);
    minPossible = 9999;
}

var type;

//are we being cheesed
if (this.now() < 45) {
    if (this.getByType(ENEMY_ZERGLING).length > 3 && this.getByType(ZERGLING).length > 0) {
        base.build(HIGH_TEMPLAR);
        return;
    }
    else if (this.getByType(ENEMY_ZERGLING).length > 0 || this.getByType(ENEMY_STALKER).length > 0) {
        if (munchkins.length === 0) {
            base.build(ZERGLING);
            return;
        }
    }
}

var enemyHasZerglings = this.getByType(ENEMY_ZERGLING).length > 0;
var enemyHasCarriers = this.getByType(ENEMY_CARRIER).length > 0;
var enemyHasHTs = this.getByType(ENEMY_HIGH_TEMPLAR).length > 0;
var enemyHasStalkers = this.getByType(ENEMY_STALKER).length > 0;
var enemyHasVRs = this.getByType(ENEMY_VOID_RAY).length > 0;

//does the enemy have units
if (enemyHasZerglings ||
    enemyHasCarriers ||
    enemyHasHTs ||
    enemyHasStalkers ||
    enemyHasVRs) {

    if (enemyHasVRs) {
        type = ZERGLING;
        if (base.gold >= base.buildables[type].goldCost) {
            base.build(type);
        }
        return;
    }
    else if (enemyHasStalkers && enemyHasHTs && ogres.length < 1) {
        type = STALKER;
        if (base.gold >= base.buildables[type].goldCost) {
            base.build(type);
        }
        return;
    }
    else if (enemyHasStalkers && enemyHasHTs && ogres.length > 0) {
        type = HIGH_TEMPLAR;
        if (base.gold >= base.buildables[type].goldCost) {
            base.build(type);
        }
        return;
    }

}
else {
    if (peons.length < this.getByType(ENEMY_WORKER).length) {
        type = WORKER;
        if (base.gold >= base.buildables[type].goldCost) {
            base.build(type);
            return;
        }
    }
}

if (peons.length < 3) {
    type = WORKER;
    if (base.gold >= base.buildables[type].goldCost) {
        base.build(type);
    }
} else {

    if (shamans.length < 2) {
        type = HIGH_TEMPLAR;
        if (base.gold >= base.buildables[type].goldCost) {
            base.build(type);
        }
    }
    else if (shamans.length > 1) {
        type = ZERGLING;
        if (base.gold >= base.buildables[type].goldCost) {
            base.build(type);
        }
    }
    else {
        type = STALKER;
        if (base.gold >= (base.buildables[type].goldCost) * 3) {
            base.build(type);
        }
    }
}
