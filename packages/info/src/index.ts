import envinfo from 'envinfo';
import WebpackCLI from 'webpack-cli';
import { utils } from 'webpack-cli';

const { logger, commands } = utils;

interface Information {
    Binaries?: string[];
    Browsers?: string[];
    System?: string[];
    npmGlobalPackages?: string[];
    npmPackages?: string | string[];
}

const DEFAULT_DETAILS: Information = {
    Binaries: ['Node', 'Yarn', 'npm'],
    Browsers: [
        'Brave Browser',
        'Chrome',
        'Chrome Canary',
        'Edge',
        'Firefox',
        'Firefox Developer Edition',
        'Firefox Nightly',
        'Internet Explorer',
        'Safari',
        'Safari Technology Preview',
    ],
    System: ['OS', 'CPU', 'Memory'],
    npmGlobalPackages: ['webpack', 'webpack-cli'],
    npmPackages: '*webpack*',
};

export default async function info(...args): Promise<string> {
    const cli = new WebpackCLI();
    const { flags: infoFlags } = commands.find((cmd) => cmd.name === 'info');
    const parsedArgs = cli.argParser(infoFlags, args, true);
    const infoArgs = parsedArgs.opts;
    const envinfoConfig = {};

    if (parsedArgs.unknownArgs.length > 0) {
        logger.error(`Unknown argument: ${parsedArgs.unknownArgs}`);
        process.exit(2);
    }

    if (infoArgs.output) {
        // Remove quotes if exist
        const output = infoArgs.output.replace(/['"]+/g, '');
        switch (output) {
            case 'markdown':
                envinfoConfig['markdown'] = true;
                break;
            case 'json':
                envinfoConfig['json'] = true;
                break;
            default:
                logger.error(`'${infoArgs.output}' is not a valid value for output`);
                process.exit(2);
        }
    }

    let output = await envinfo.run(DEFAULT_DETAILS, envinfoConfig);
    output = output.replace(/npmPackages/g, 'Packages');
    output = output.replace(/npmGlobalPackages/g, 'Global Packages');

    const finalOutput = output;
    logger.raw(finalOutput);
    return finalOutput;
}
