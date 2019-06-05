import config from './config';

class Sample {
    private readonly _f: number;
    private _branches: boolean[] = [];

    constructor(private readonly _variables: number[]) {
        this._f = config.function(_variables);
        for (let i = 0; i < config.n; i++) {
            this._branches[i] = false;
        }

        this.isBranch = this.isBranch.bind(this);

    }

    get variables(): number[] {
        return this._variables;
    }

    get f(): number {
        return this._f;
    }

    growBranch(i: number): Sample {
        const newSample = new Sample(this._variables.map((value, index) =>
            index !== i ? value : - Math.random() * 2 * value));
        newSample._branches = this._branches.map((value, index) => index !== i ? value : true);
        return newSample;
    }

    isBranch(branch: number): boolean {
        return this._branches[branch];
    }
}

export default Sample;
