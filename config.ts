import {
    spheric,
    rastrigin,
} from './libs/functions';

const n = 2;

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
    function: spheric,
};
