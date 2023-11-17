import fs from 'fs/promises';
import path from 'path';

import * as jsYaml from 'js-yaml';

const configPath = path.resolve(process.cwd(), '.circleci', 'config.yml');
const circleCIConfig = jsYaml.load(await fs.readFile(configPath));

// eslint-disable-next-line no-console
console.log(circleCIConfig.parameters['cache-buster'].default);
