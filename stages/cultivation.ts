import Sample from '../Sample';
import config from '../config';

const {
    upperBounds,
    lowerBounds,
    n,
} = config;

export default (): Sample[] => {
    const samples: Sample[] = [];
    let k = 1;

    samples[0] = new Sample(upperBounds);
    samples[1] = new Sample(lowerBounds);

    while(samples.length < config.p) {
        k++;
        const r = Math.random();

        break;
    }

    return samples.splice(0, config.p);
}