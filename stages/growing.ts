import * as _ from 'lodash';

import Sample from '../Sample';
import config from '../config';

const {
    upperBounds,
    lowerBounds,
    p,
    n,
} = config;

const r = distance(upperBounds, lowerBounds);

function distance(s1: number[], s2: number[]) {
    return Math.sqrt(s1.reduce((acc, value, i) => {
        return acc + Math.pow((s1[i] - s2[i])^2, 2);
    }, 0))
}

function matingP(s1: Sample, s2: Sample) {
    return 1 - distance(s1.variables, s2.variables) / r;
}

function branchingP(i: number, j: number) {
    return 1 - 1 / Math.exp(Math.pow(i - j, 2));
}

export default (garden: Sample[]): Sample[] => {
    const g1 = [];
    const g2 = [];
    const g3 = [];

    garden.forEach((s1, index1) => {
        // Mating
        garden.forEach((s2, index2) => {
            if (index1 === index2) {
                return;
            }

            const pm = matingP(s1, s2);
            const G = [];
            const H = [];

            for (let i = 0; i < n; i++) {
                if (pm <= Math.random()) {
                    G.push(s1[i] + s2[i]);
                    H.push(s2[i] + s1[i]);
                } else {
                    G.push(g1[i]);
                    H.push(s2[i]);
                }
            }

            g1.push(new Sample(G));
            g1.push(new Sample(H));
        });
    });

    return _.sortBy([
        ...garden,
        ...g1,
        ...g2,
        ...g3,
    ], sample => sample.f).splice(0, p)
}

