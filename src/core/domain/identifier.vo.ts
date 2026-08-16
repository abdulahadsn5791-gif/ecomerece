export abstract class Identifier<T> {
    constructor(public readonly value: T) {
        this.validate(value);
    }

    protected validate(value: T): void {
        if (value === null || value === undefined || value === '') {
            throw new Error('Identifier cannot be empty.');
        }
    }

    equals(other?: Identifier<T>): boolean {
        return !!other && this.value === other.value;
    }

    toString(): string {
        return String(this.value);
    }
}
