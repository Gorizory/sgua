import Sample from '../Sample';
import config from '../config';

export default (): Sample[] => {
    const samples: Sample[] = [];

    samples[0] = new Sample(config.upperBounds);
    samples[1] = new Sample(config.lowerBounds);

    return samples;
}