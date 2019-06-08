const cluster = require('cluster');
const fs = require('fs');
const os = require('os');

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
} = config;

const analysisPath = './analysis';
if (!fs.existsSync(analysisPath)) {
    fs.mkdirSync(analysisPath);
}

if (cluster.isMaster) {
    let workersCount = 0;
    function initWorker(i) {
        const worker = cluster.fork();
        worker.send(i);
        workersCount++;
        console.log(workersCount);

        worker.on('message', (msg) => {
            stringForFile = `${stringForFile}${msg}`;
        });
    }

    const processors = os.cpus().length;
    const maxProcesses = processors > 4 ?  processors - 4 : 1;
    for (let i = 0; i < maxProcesses; i++) {
        initWorker(i);
    }

    let stringForFile = '';

    cluster.on('exit', () => {
        if (multistart - workersCount > 0) {
            initWorker(workersCount)
        }
        if (Object.values(cluster.workers).length === 0) {
            fs.writeFileSync(`${analysisPath}/results_${n}_test.csv`, stringForFile);
            process.exit();
        }
    });
} else {
    process.on('message', (i) => {
        const bestSamples: Sample[] = [];
        let iteration = 0;
        let fCount = 0;

        let garden = cultivation();

        while (bestSamples.length < dt || (bestSamples[0].f - bestSamples[dt - 1].f) > df) {
            iteration++;
            const {
                garden: newGarden,
                fCount: addFCount,
            } = growing(garden);

            fCount += addFCount;
            garden = newGarden;

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
        }

        const goodResult = Math.sqrt(garden[0].variables.reduce((sum, value) => sum + Math.pow(value, 2), 0)) < dx;

        process.send(`${i};${fCount};${iteration};${goodResult ? 1 : 0};\n`);
        process.exit();
    });
}
