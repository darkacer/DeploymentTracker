import lwc from '@lwc/rollup-plugin';
import replace from '@rollup/plugin-replace';
import copy from 'rollup-plugin-copy';
// import multi from '@rollup/plugin-multi-entry';



export default {
    // input: 'client/main.js',
    input: 'client/popup.js',
    // input: ['client/main.js', 'client/popup.js'],
    output: {
        dir: 'dist/popup',
        format: 'esm',
        inlineDynamicImports: true,
    },
    plugins: [
        replace({
            'process.env.NODE_ENV': JSON.stringify('development'),
            preventAssignment: true
        }),
        lwc(),
        // multi({ relative: 'client/' }),
        copy({
            targets: [
              { src: 'node_modules/@salesforce-ux/design-system/assets', dest: 'dist/popup'}
            ],
            copyOnce: true
        }),
        copy({
            targets: [
              { src: 'client/index.html', dest: 'dist/popup' },
              { src: 'client/main.html', dest: 'dist/popup' },
              { src: 'client/popup.html', dest: 'dist/popup' },
            //   { src: 'client/popup.js', dest: 'dist/popup' },
              { src: 'client/assets', dest: 'dist/popup' },
              { src: 'extension/scripts', dest: 'dist' },
              { src: 'extension/manifest.json', dest: 'dist' },
              { src: 'images', dest: 'dist' },
            ]
        })
    ],
};