(function() {
  function SongPlayer() {
    var SongPlayer = {};

    /**
    * @desc Current song object
    * @type {Object}
    */
    var currentSong = null;

    /**
    * @desc Buzz object audio file
    * @type {Object}
    */
    var currentBuzzObject = null;

    /**
    * @function setSong
    * @desc Stops currently playing song and loads new audio file as currentBuzzObject
    * @param {Object} song
    */
    var setSong = function(song) {
      if (currentBuzzObject) {
        currentBuzzObject.stop();
        currentSong.playing = null;
      }

      currentBuzzObject = new buzz.sound(song.audioUrl, {
        formats: ['mp3'],
        preload: true
      });

      currentSong = song;
    };

    /**
    * @function play
    * @desc If current song, stop playing, else load new audio file as currentBuzzObject
    * @param {Object} song
    */
    SongPlayer.play = function(song) {
      if (currentSong !== song) {
        setSong(song);
        currentBuzzObject.play();
        song.playing = true;
      } else if (currentSong === song) {
        if (currentBuzzObject.isPaused()) {
          currentBuzzObject.play();
          song.playing = true;
        }
      }
    };

    /**
    * @function pause
    * @desc Stops currently playing song
    * @param {Object} song
    */
    SongPlayer.pause = function(song) {
      currentBuzzObject.pause();
      song.playing = false;
    };

    return SongPlayer;
  }

  angular
    .module('blocJams')
    .factory('SongPlayer', SongPlayer);
})();
