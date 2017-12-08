(function() {
  function config($stateProvider, $locationProvider) {
    // removes (#!) hashbang mode - prettify routes/url
    $locationProvider
      .html5Mode({
        enabled: true,
        requireBase: false // avoid $location error
      });

    $stateProvider
      .state('landing', {
        url: '/',
        templateUrl: '/templates/landing.html'
      })
      .state('album', {
        url: '/album',
        templateUrl: '/templates/album.html'
      })
      .state('collection', {
        url: '/collection',
        templateUrl: '/templates/collection.html'
      });
  }

  angular
    .module('blocJams', ['ui.router'])
    .config(config);
})();
