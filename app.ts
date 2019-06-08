const fs = require('fs');

import config from './config';
import Sample from './Sample';
import cultivation from './stages/cultivation';
import growing from './stages/growing';

const {
    n,
    dt,
    df,
    dx,
    multistart,
    functionName,
} = config;

const functionPath = `./${functionName}`;
if (!fs.existsSync(functionPath)) {
    fs.mkdirSync(functionPath);
}
const nPath = `${functionPath}/${n}`;
if (!fs.existsSync(nPath)) {
    fs.mkdirSync(nPath);
}

for (let i = 0; i < multistart; i++) {
    const iterationPath = `${nPath}/${i}`;
    if (!fs.existsSync(iterationPath)) {
        fs.mkdirSync(iterationPath);
    }

    const bestSamples: Sample[] = [];
    let stringForFile = '';
    let iteration = 0;

    let garden = cultivation();

    while (bestSamples.length < dt || (bestSamples[0].f - bestSamples[dt - 1].f) > df) {
        iteration++;
        garden = growing(garden);

        switch (bestSamples.length) {
            case 0:
                bestSamples.push(garden[0]);
                break;

            case dt:
                bestSamples.shift();
                bestSamples.push(garden[0]);
                break;

            default:
                bestSamples.push(garden[0]);
                break;
        }

        stringForFile = `${stringForFile}${iteration};${garden[0].f};\n`;
    }

    fs.writeFileSync(`${iterationPath}/results.csv`, stringForFile);

    if (Math.sqrt(garden[0].variables.reduce((sum, value) => sum + Math.pow(value, 2), 0)) < dx) {
        console.log('Good result:');
    } else {
        console.log('Bad result:');
    }
    garden[0].print();
}


