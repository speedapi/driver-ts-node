import typescript from 'rollup-plugin-typescript2'

export default [
  {
    input: './src/index.ts',
    output: {
      file: './dist/index.js',
      format: 'cjs',
    },
    external: [
      "@speedapi/driver/transport/universal",
      "@speedapi/driver",
      "net", "ws", "tls"
    ],
    plugins: [typescript({ tsconfig: './buildconfig.json' })],
  },
]
