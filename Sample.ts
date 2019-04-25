import config from './config';

class Sample {
    readonly _f: number;

    constructor(readonly _variables: number[]) {
        this._f = config.function(_variables);
    }

    get variables(): number[] {
        return this._variables;
    }

    get f(): number {
        return this._f;
    }
}

export default Sample;
