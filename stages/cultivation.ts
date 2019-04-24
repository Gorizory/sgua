import Sample from '../Sample';
import config from '../config';

const {
    upperBounds,
    lowerBounds,
    n,
    p
} = config;

export default (): Sample[] => {
    const samples: Sample[] = [];
    let k = 1;

    samples[0] = new Sample(upperBounds);
    samples[1] = new Sample(lowerBounds);

    while (samples.length < p) {
        k++;
        const r = Math.random();

        for (let i = 0; i < Math.pow(2, k) - 2; i++) {
            let part = n / k;
            const variables = [];

            let linearCombination = (i + 1).toString(2);
            while (linearCombination.length !== k) {
                linearCombination = `0${linearCombination}`;
            }

            for (let j = 0; j < n; j++) {
                if (j > part - 1) {
                    part += n / k;
                    linearCombination = linearCombination.slice(1);
                }

                let value = samples[1].variables[j];
                value += (samples[0].variables[j] - samples[1].variables[j]) *
                    (linearCombination.startsWith('1') ? r : (1 - r));
                variables.push(value);
            }

            samples.push(new Sample(variables));
        }
    }

    return samples.splice(0, p);
}
