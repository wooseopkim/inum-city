type Variation = {
    base: number;
    diff: number;
};

export function color(random: () => number, { base, diff }: Variation) {
    return Array(3).fill(null)
        .map(() => random() * diff + base) as [number, number, number];
}

export function angle(random: () => number, degree: number) {
    return (random() - 0.5) * degree;
}
