import * as _ from 'lodash';

import Sample from '../Sample';
import config from '../config';

const {
    upperBounds,
    lowerBounds,
    p,
    n,
    similarityEps,
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

function similarity(s1: Sample, s2: Sample) {
    let sim = 0;
    for (let i = 0; i < n; i++) {
        sim += Math.abs(s1.variables[i] - s2.variables[i]) / (upperBounds[i] - lowerBounds[i]);
    }
    return sim;
}

export default (garden: Sample[]): {garden: Sample[], fCount: number} => {
    const g1 = [];
    const g2 = [];
    const g3 = [];

    // Mating
    garden.forEach((s1, index1) => {
        garden.forEach((s2, index2) => {
            if (index1 === index2) {
                return;
            }

            if (Math.random() < matingP(s1, s2)) {
                const newSampleVariables = [];
                const l = Math.floor(Math.random() * n);
                for (let i = 0; i < n; i++) {
                    if (i <= l) {
                        newSampleVariables.push(s1.variables[i]);
                    } else {
                        newSampleVariables.push(s2.variables[i]);
                    }
                }
                g1.push(new Sample(newSampleVariables));
            }
        });
    });

    // Branching
    garden.forEach((sample) => {
        const {
            variables,
            isBranch,
        } = sample;
        variables.forEach((b1, i) => {
            let bp = 0;
            if (!isBranch(i)) {
                bp = 1;
            }
            variables.forEach((b2, j) => {
                if (!isBranch(j) && Math.random() < (bp ? bp : branchingP(b1, b2))) {
                    g2.push(sample.growBranch(j));
                }
            });
        });
    });

    // Vaccinating
    garden.forEach((s1, i) => {
        garden.forEach((s2, j) => {
            if (i === j) {
                return;
            }

            if (similarity(s1, s2) >= n * similarityEps) {
                const variables1 = [];
                const variables2 = [];
                for (let index = 0; index < n; index++) {
                    const sim =
                        Math.abs(s1.variables[index] - s2.variables[index]) / (upperBounds[index] - lowerBounds[index]);
                    variables1.push(sim <= similarityEps ? s1.variables[index] : s2.variables[index]);
                    variables2.push(sim <= similarityEps ? s2.variables[index] : s1.variables[index]);
                }
                g3.push(new Sample(variables1));
                g3.push(new Sample(variables2));
            }
        });
    });

    return {
        garden: _.sortBy([
            ...garden,
            ...g1,
            ...g2,
            ...g3,
        ], sample => sample.f).splice(0, p),
        fCount: g1.length + g2.length + g3.length,
    };
}

