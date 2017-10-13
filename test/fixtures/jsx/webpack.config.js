module.exports = {
    entry: {
        index: './src/js/index.jsx'
    },

    externals: [{
        'react': {
            root: 'window.React',
            var: 'window.React',
            commonjs2: 'react',
            commonjs: 'react',
            amd: 'react',
            umd: 'react'
        },

        'react-dom': {
            root: 'window.ReactDOM',
            var: 'window.ReactDOM',
            commonjs2: 'react-dom',
            commonjs: 'react-dom',
            amd: 'react-dom',
            umd: 'react-dom'
        }
    }]
};
