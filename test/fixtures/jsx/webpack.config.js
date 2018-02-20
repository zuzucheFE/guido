module.exports = {
    entry: {
        index: './src/js/index.jsx'
    },

    output: {
        // libraryTarget: 'commonjs'
    },

    externals: [{
        'react': {
            root: 'window.React',
            var: 'window.React',
            commonjs: 'react',
            commonjs2: 'react',
            amd: 'react',
            umd: 'react'
        },

        'react-dom': {
            root: 'window.ReactDOM',
            var: 'window.ReactDOM',
            commonjs: 'react-dom',
            commonjs2: 'react-dom',
            amd: 'react-dom',
            umd: 'react-dom'
        }
    }]
};
