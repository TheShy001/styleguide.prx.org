/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
  System.config({
    paths: {
      // paths serve as alias
      'npm:': 'node_modules/'
    },
    // map tells the System loader where to look for things
    map: {
      // our app is within the app folder
      app: 'app',

      // angular bundles
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',

      // other libraries
      'rxjs': 'npm:rxjs',

      // 3rd party libs
      'angular-2-dropdown-multiselect': 'npm:angular-2-dropdown-multiselect/bundles/dropdown.umd.js',
      'c3': 'npm:c3',
      'd3': 'npm:d3',
      'moment': 'npm:moment',
      'pikaday': 'npm:pikaday',
    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      app: {
        defaultExtension: 'js'
      },
      c3: {
        main: 'c3.js',
        defaultExtension: 'js',
        format: 'cjs'
      },
      d3: {
        main: 'd3.js',
        defaultExtension: 'js',
        format: 'cjs'
      },
      moment: {
        main: 'moment.js',
        defaultExtension: 'js',
        format: 'cjs'
      },
      pikaday: {
        main: 'pikaday.js',
        defaultExtension: 'js',
        format: 'cjs'
      },
      rxjs: {
        defaultExtension: 'js'
      },
      'ngx-prx-styleguide': {
        main: 'index.js',
        defaultExtension: 'js'
      }
    }
  });
})(this);
