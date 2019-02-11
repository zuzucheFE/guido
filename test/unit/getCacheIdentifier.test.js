'use strict';

const getCacheIdentifier = require('../../lib/utils/getCacheIdentifier');

describe('babel cacheIdentifier', () => {
    it('production mode, one packages', () => {
        let result = getCacheIdentifier('production', [
            'babel-preset-zuzuche'
        ]);

        expect(result.split(':')).toEqual(
            expect.arrayContaining([
                expect.stringMatching('production'),
                expect.stringMatching(/babel-preset-zuzuche@/),
            ]),
        );
    });

    it('development mode, one packages', () => {
        let result = getCacheIdentifier('development', [
            'babel-preset-zuzuche'
        ]);

        expect(result.split(':')).toEqual(
            expect.arrayContaining([
                expect.stringMatching('development'),
                expect.stringMatching(/babel-preset-zuzuche@/),
            ]),
        );
    });

    it('multi-packages', () => {
        let result = getCacheIdentifier('production', [
            '@babel/core',
            'babel-preset-zuzuche'
        ]);

        expect(result.split(':')).toEqual(
            expect.arrayContaining([
                expect.stringMatching('production'),
                expect.stringMatching(/@babel\/core@/),
                expect.stringMatching(/babel-preset-zuzuche@/),
            ]),
        );
    });

    it('environment is empty string', () => {
        let result = getCacheIdentifier('', [
            '@babel/core',
            'babel-preset-zuzuche'
        ]);

        expect(result.split(':')).toEqual(
            expect.arrayContaining([
                expect.stringMatching(''),
                expect.stringMatching(/@babel\/core@/),
                expect.stringMatching(/babel-preset-zuzuche@/),
            ]),
        );
    });

    it('environment is Object', () => {
        let result = getCacheIdentifier({}, [
            '@babel/core',
            'babel-preset-zuzuche'
        ]);

        expect(result.split(':')).toEqual(
            expect.arrayContaining([
                expect.stringMatching(''),
                expect.stringMatching(/@babel\/core@/),
                expect.stringMatching(/babel-preset-zuzuche@/),
            ]),
        );
    });
});
