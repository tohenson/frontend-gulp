const pathDir = {
    build: {
        html: 'dist',
        js: 'dist/js',
        css: 'dist/css',
        img: 'dist/img',
        fonts: 'dist/fonts'
    },
    src: {
        fontAwesome: 'app/libs/font-awesome',
        bootstrap: 'app/libs/bootstrap-sass/assets',
        html: 'app/*.html',
        js: 'app/js/main.js',
        jsLib: 'app/js/*.js',
        sass: 'app/sass/**/*.+(scss|sass)',
        cssLib: 'dist/css/libs.css',
        img: 'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*'
    },
    watch: {
        html: 'app/**/*.html',
        js: 'app/js/**/*.js',
        sass: 'app/sass/**/*.+(scss|sass)',
        img: 'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*'
    },
    clean: './dist',
    output: 'dist'
};

module.exports = {
    path: pathDir
};