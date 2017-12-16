(function() {
  /* is a factory function. It returns an object that describes the directive's behavior
  to Angular's HTML compiler. This object communicates the behavior through options. */
  function seekBar($document) {
    /**
    * @function calculatePercent
    * @desc Calculates the horizontal percent along the seek bar where the event (passed in from the view as  $event) occurred.
    */
    var calculatePercent = function(seekBar, event) {
      var offsetX = event.pageX - seekBar.offset().left;
      var seekBarWidth = seekBar.width();
      var offsetXPercent = offsetX / seekBarWidth;
      offsetXPercent = Math.max(0, offsetXPercent);
      offsetXPercent = Math.min(1, offsetXPercent);
      return offsetXPercent;
    };

    return {
      templateUrl: '/templates/directives/seek_bar.html', // URL of template
      replace: true, // replace el, false: replace el contents
      restrict: 'E', // restrict to an element directive
      scope: { }, // create new scope for directive
      link: function(scope, element, attributes) {
        // directive logic to return
        scope.value = 0;
        scope.max = 100;

        /**
        * @desc Holds the element that matches the directive (<seek-bar>) as a jQuery object so we can call jQuery methods on it.
        * @type {Object}
        */
        var seekBar = $(element);

        /**
        * @function percentString
        * @desc A function that calculates a percent based on the value and maximum value of a seek bar.
        @returns {string}
        */
        var percentString = function () {
          var value = scope.value;
          var max = scope.max;
          var percent = value / max * 100;
          return percent + "%";
        };

        /**
        * @function fillStyle
        * @desc Updates the seek bar value based on the seek bar's width and the location of the user's click on the seek bar.
        * @return {Object}
        */
        scope.fillStyle = function() {
          return {width: percentString()};
        };

        /**
        * @function onClickSeekBar
        * @desc Updates the seek bar value based on the seek bar's width and the location of the user's click on the seek bar.
        */
        scope.onClickSeekBar = function(event) {
          var percent = calculatePercent(seekBar, event);
          scope.value = percent * scope.max;
        };

        /**
        * @function trackThumb
        * @desc Uses $apply to constantly apply the change in value of  scope.value as the user drags the seek bar thumb.
        */
        scope.trackThumb = function() {
          $document.bind('mousemove.thumb', function(event) {
            var percent = calculatePercent(seekBar, event);
            scope.$apply(function() {
              scope.value = percent * scope.max;
            });
          });

          $document.bind('mouseup.thumb', function() {
            $document.unbind('mousemove.thumb');
            $document.unbind('mouseup.thumb');
          });
        };
      }
    };
  }

  angular
    .module('blocJams')
    .directive('seekBar', ['$document', seekBar]);
})();
