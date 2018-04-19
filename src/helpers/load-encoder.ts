import { IEncoderConstructor } from '../interfaces';

export const loadEncoder = (encoderConstructorRegistry: Map<string, [ RegExp, IEncoderConstructor ]>, url: string) => {
    if (encoderConstructorRegistry.has(url)) {
        throw new Error('There is already an encoder stored with the given url.');
    }

    let isRegisteringMoreThanOneEncoder = false;

    // @todo This is an ugly hack to work around the limitations of importScripts().
    (<any> self).registerEncoder = (regex: RegExp, encoderConstructor: IEncoderConstructor) => {
        if (encoderConstructorRegistry.has(url)) {
            isRegisteringMoreThanOneEncoder = true;

            /*
             * Throw an error to cause importScripts() to fail. Throwing a meaningful error here is not possible as importScripts() will
             * not rethrow this error.
             */
            throw new Error();
        } else {
            encoderConstructorRegistry.set(url, [ regex, encoderConstructor ]);
        }
    };

    try {
        importScripts(url);
    } catch (err) {
        if (isRegisteringMoreThanOneEncoder) {
            encoderConstructorRegistry.delete(url);

            throw new Error('It is only possible to register one encoder at a time.');
        }

        throw err;
    } finally {
        (<any> self).registerEncoder = undefined;
    }

    const entry = encoderConstructorRegistry.get(url);

    if (entry === undefined) {
        throw new Error('No encoder could not be registered.');
    }

    return entry[0];
};
