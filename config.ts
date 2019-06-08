import * as functions from './libs/functions';

enum functionNames {
    Spheric = 'spheric',
    Rastrigin = 'rastrigin',
}

const n = 8;
const functionName = functionNames.Rastrigin;

const upperBounds = [];
const lowerBounds = [];
for (let i = 0; i < n; i++) {
    upperBounds.push(2.5);
    lowerBounds.push(-2.5);
}

export default {
    upperBounds,
    lowerBounds,
    n,
    p: 50,
    dt: 30,
    df: 10e-5,
    dx: 10e-2,
    similarityEps: 0.5,
    function: functions[functionName],
    functionName,
    multistart: 100,
};
