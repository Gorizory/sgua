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

    // Mating
    garden.forEach((s1, index1) => {
        garden.forEach((s2, index2) => {
            if (index1 === index2) {
                return;
            }

            if (matingP(s1, s2) <= Math.random()) {
                const newSampleVariables = [];
                const l = Math.floor(Math.random() * n);
                for (let i = 0; i < n; i++) {
                    if (i <= l) {
                        newSampleVariables.push(s1._variables[i]);
                    } else {
                        newSampleVariables.push(s2._variables[i]);
                    }
                }
                g1.push(new Sample(newSampleVariables));
            }
        });
    });

    return _.sortBy([
        ...garden,
        ...g1,
        ...g2,
        ...g3,
    ], sample => sample.f).splice(0, p)
}

