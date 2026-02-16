export class Commentary {
    constructor() {
        this.templates = {
            'START': [
                "Neural Link Established. Bowler is warming up.",
                "Weather conditions: Digital Storm. ideal for swing.",
                "Crowd aggregation at 98%. Let's play."
            ],
            'HIT': [
                "Absolute tracer bullet!",
                "That's gone into orbit!",
                "Sweet sound off the blade via haptic feedback.",
                "Disrespectful to the laws of physics!",
                "Quantum tunneling detected on that shot!"
            ],
            'MISS': [
                "Beaten all ends up!",
                "Bowler is inside their head now.",
                "Air gap detected between bat and ball.",
                "Neural prediction failure.",
                "Lucky to survive that one."
            ],
            'WICKET': [
                "CLEAN BOWLED! The holograms rely again!",
                "System Crash! Player dismissed.",
                "That's the end of the simulation for them.",
                "Fatal Error at the crease."
            ]
        };
    }

    getLine(event, detail) {
        const lines = this.templates[event] || ["Processing..."];
        const baseLine = lines[Math.floor(Math.random() * lines.length)];
        return baseLine;
    }
}
