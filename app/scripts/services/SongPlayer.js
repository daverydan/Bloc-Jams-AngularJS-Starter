(function() {
  function SongPlayer($rootScope, Fixtures) {
    var SongPlayer = {};

    /**
    * @desc Fixtures factory service to retrieve album
    * @type {Object}
    */
    var currentAlbum = Fixtures.getAlbum();

    /**
    * @function getSongIndex
    * @desc finds the index of the passed in song in
    * the album's list of songs
    * @param {Object} song
    */
    var getSongIndex = function(song) {
      return currentAlbum.songs.indexOf(song);
    };

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
        SongPlayer.currentSong.playing = null;
      }

      currentBuzzObject = new buzz.sound(song.audioUrl, {
        formats: ['mp3'],
        preload: true
      });

      // timeupdate - HTML5 audio event
      // The time indicated by the element's currentTime attribute has changed.
      // http://buzz.jaysalvat.com/documentation/events/#undefinedtimeupdate
      // http://buzz.jaysalvat.com/documentation/sound/#undefinedevents
      currentBuzzObject.bind('timeupdate', function() {
        $rootScope.$apply(function() {
          SongPlayer.currentTime = currentBuzzObject.getTime();
          autoPlayNextSong(song);
        });
      });

      SongPlayer.currentSong = song;
    };

    /**
    * @function autoPlayNextSong
    * @desc If current song is finished, auto play the next song
    */
    var autoPlayNextSong = function(song) {
      if(song.duration == SongPlayer.currentTime) {
        setSong(song);
        SongPlayer.next();
        SongPlayer.setVolume(SongPlayer.volume);
      }
    };

    /**
    * @function playSong
    * @desc Play currentBuzzObject & set song.playing state
    * @param {Object} song
    */
    var playSong = function(song) {
      currentBuzzObject.play();
      song.playing = true;
      SongPlayer.setVolume(SongPlayer.volume);
    };

    /**
    * @function playSong
    * @desc Stop currentBuzzObject & set song.playing state
    */
    var stopSong = function() {
      currentBuzzObject.stop();
      SongPlayer.currentSong.playing = null;
    };

    /**
    * @desc Current song object
    * @type {Object}
    */
    SongPlayer.currentSong = null;

    /**
    * @desc Current playback time (in seconds) of currently playing song
    * @type {Number}
    */
    SongPlayer.currentTime = null;

    /**
    * @desc Set initial volume
    * @type {Number}
    */
    SongPlayer.volume = 80;

    /**
    * @desc Set initial max volume
    * @type {Number}
    */
    SongPlayer.max = 100;

    /**
    * @desc Player is muted
    * @type {Boolean}
    */
    SongPlayer.muted = false;

    /**
    * @desc Stores volume before muting
    * @type {Number}
    */
    SongPlayer.previousVolume = 0;

    /**
    * @function play
    * @desc If current song, stop playing, else load new audio file as currentBuzzObject
    * @param {Object} song
    */
    SongPlayer.play = function(song) {
      song = song || SongPlayer.currentSong;
      if (SongPlayer.currentSong !== song) {
        setSong(song);
        playSong(song);
      } else if (SongPlayer.currentSong === song) {
        if (currentBuzzObject.isPaused()) {
          playSong(song);
        }
      }
    };

    /**
    * @function pause
    * @desc Stops currently playing song
    * @param {Object} song
    */
    SongPlayer.pause = function(song) {
      song = song || SongPlayer.currentSong;
      currentBuzzObject.pause();
      song.playing = false;
    };

    /**
    * @function mute
    * @desc Mute currently playing song
    * @param {Object} song
    */
    SongPlayer.mute = function() {
      SongPlayer.previousVolume = SongPlayer.volume;
      SongPlayer.volume = 0;
      SongPlayer.setVolume(SongPlayer.volume);
    };

    /**
    * @function unmute
    * @desc Unmute currently playing song
    */
    SongPlayer.unmute = function() {
      SongPlayer.volume = SongPlayer.previousVolume;
      SongPlayer.setVolume(SongPlayer.volume);
    };

    /**
    * @function previous
    * @desc Gets previous song of currently playing song
    */
    SongPlayer.previous = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex--;

      if(currentSongIndex < 0) {
        stopSong();
      } else {
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    };

    /**
    * @function previous
    * @desc Gets next song of currently playing song
    */
    SongPlayer.next = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex++;

      if(currentSongIndex === currentAlbum.songs.length) {
        stopSong();
      } else {
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    };

    /**
    * @function setCurrentTime
    * @desc Set current time (in seconds) of currently playing song
    * @param {Number} time
    */
    SongPlayer.setCurrentTime = function(time) {
      if (currentBuzzObject) {
        currentBuzzObject.setTime(time);
      }
    };

    SongPlayer.setVolume = function(volume) {
      if (currentBuzzObject) {
        currentBuzzObject.setVolume(volume);
      }

      if (SongPlayer.volume > 0) {
        SongPlayer.muted = false;
      } else {
        SongPlayer.muted = true;
      }

      currentBuzzObject.bind('volumechange', function() {
        $rootScope.$apply(function() {
          SongPlayer.volume = currentBuzzObject.getVolume();
        });
      });
    };

    return SongPlayer;
  } // SongPlayer()


  angular
    .module('blocJams')
    .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();
