export function limitNumberInRange(val: number, min: number, max: number): number {
    return Math.min(Math.max(val, min), max)
}

export function getPercent(val: number, min: number, max: number): number {
    return (val - min) / (max - min) * 100;
}

export function getRandomInt(range: [number, number]): number {
    return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
}