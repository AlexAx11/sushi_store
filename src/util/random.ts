export function  getRandomNumber(min: number, max: number):number {
    if (min === max) {
        return min;
    }
    if (min > max) {
        [min, max] = [max, min]
    }
    return min + Math.round(Math.random() * (max - min));
}