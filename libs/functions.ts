export function spheric(x: number[]): number {
    return x.reduce((sum, x_i) => {
        return sum + Math.pow(x_i, 2);
    }, 0)
}

export function rastrigin(x: number[]): number {
    const a = 10;

    return x.reduce((sum, x_i) => {
        return sum + Math.pow(x_i, 2) - a * Math.cos(2 * Math.PI * x_i) + a;
    }, 0);
}