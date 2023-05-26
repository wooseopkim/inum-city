import fisheryates from "./fisheryates";

type Variation = {
    base: number;
    diff: number;
};

export function color(random: () => number, { base, diff }: Variation = { base: 180, diff: 72 }) {
    const [x, y, z] = Array(3).fill(null)
        .map(() => random() * diff + base)
        .sort((a, b) => a - b) as [number, number, number];
    const c = 0.05;
    const d = 0.15;
    const [r, g, b] = fisheryates([x + c * y + d * z, (1 - c) * y, (1 - d) * z]);
    return [r, g, b];
}

export function angle(random: () => number, degree: number) {
    return (random() - 0.5) * degree;
}
