
// https://vitejs.dev/config/
export default  {
    base:'./',
    esbuild: {
        supported: {
            // needed to load Box2D without gymnastics
            'top-level-await': true
        },
    }
}
