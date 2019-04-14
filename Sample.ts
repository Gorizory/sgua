class Sample {
    constructor(private _variables: number[]) {}

    get variables(): number[] {
        return this._variables;
    }
}

export default Sample;