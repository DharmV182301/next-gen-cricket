export class BowlerBrain {
    constructor() {
        this.confidence = 100;
        this.deliveryTypes = ['NORMAL', 'FAST', 'SPIN', 'SWING'];
        this.history = [];

        // Track player performance per type
        this.playerStats = {
            'NORMAL': { faces: 0, hits: 0 },
            'FAST': { faces: 0, hits: 0 },
            'SPIN': { faces: 0, hits: 0 },
            'SWING': { faces: 0, hits: 0 }
        };

        this.difficultyLevel = 1;
    }

    recordOutcome(type, outcome) {
        // outcome: 'HIT', 'MISS', 'WICKET'
        if (this.playerStats[type]) {
            this.playerStats[type].faces++;
            if (outcome === 'HIT') this.playerStats[type].hits++;
        }

        this.history.push({ type, outcome });

        // Adjust difficulty
        if (this.history.length % 6 === 0) {
            this.difficultyLevel += 0.5;
        }
    }

    decideDelivery() {
        // Find player's weakness (lowest hit rate)
        let weakness = 'NORMAL';
        let minHitRate = 1.0;

        for (const type of this.deliveryTypes) {
            const stats = this.playerStats[type];
            if (stats.faces > 2) { // Need some data
                const rate = stats.hits / stats.faces;
                if (rate < minHitRate) {
                    minHitRate = rate;
                    weakness = type;
                }
            }
        }

        // Strategy:
        // 70% chance to target weakness or throw a curveball
        // 30% chance to be random (to gather more data or keep player guessing)
        let selectedType = weakness;
        if (Math.random() > 0.7) {
            selectedType = this.deliveryTypes[Math.floor(Math.random() * this.deliveryTypes.length)];
        }

        // Calculate dynamic speed based on difficulty
        const baseSpeed = 10 + (this.difficultyLevel * 1.5);
        const speed = baseSpeed + (Math.random() * 4);

        let targetX = 0;
        if (selectedType === 'SWING') {
            targetX = (Math.random() - 0.5) * 100; // Aim wide
        }

        console.log(`Bowler Brain: Weakness detected as ${weakness}. Bowling ${selectedType}.`);

        return { type: selectedType, speed, targetX };
    }
}
