var player;
this.onload = function () {
    player = new Player();
    player.MockMovies();
}

Player.prototype.VideoElement = null;
Player.prototype.Autoplay = false;
Player.prototype.StartTime = 0;

function Player() {
    console.log('Player()');
    this.VideoElement = document.querySelector("#video");

    this.SetInitialValues();
    this.ConfigureEvents();
}

Player.prototype.MovieList = [];
Player.prototype.MockMovies = function () {
    this.MovieList.push(new Movie("Big Buck Bunny", "http://distribution.bbb3d.renderfarming.net/video/mp4/bbb_sunflower_1080p_30fps_normal.mp4", "poster.png", "video/mp4"));
    this.MovieList.push(new Movie("Elephant's Dream", "https://archive.org/download/ElephantsDream/ed_hd.mp4", "ed.png", "video/mp4"));
}

/*
* Player Controls
*/

Player.prototype.LoadMovie = function (mIndex) {
    console.log('LoadMovie()');

    this.SetInitialValues();

    var movie = this.MovieList[mIndex];
    var source = this.CreateMovieSource(movie);
    this.VideoElement.appendChild(source);

    var poster = "/images/" + movie.Poster;
    this.VideoElement.setAttribute("poster", poster);
    this.VideoElement.setAttribute("preload", "auto");

    this.VideoElement.load();
}

Player.prototype.CreateMovieSource = function (movie) {
    var source = document.createElement("source");
    source.setAttribute("src", movie.MediaUrl);
    source.setAttribute("type", movie.Type);

    return source;
}

Player.prototype.SetInitialValues = function () {
    this.GetParameters();
    this.VideoElement.volume = 0.3;
    this.VideoElement.autoplay = this.Autoplay;
    this.VideoElement.autoBuffer = true;
}

Player.prototype.PlayPause = function () {
    if (this.VideoElement.paused) {
        this.Play();
        return;
    }

    this.Pause();
}

Player.prototype.Play = function () {
    console.log('Play()');
    this.VideoElement.play();
}

Player.prototype.Pause = function () {
    console.log('Pause() ->' + this.VideoElement.currentTime.toString());
    this.VideoElement.pause();
}

Player.prototype.Mute = function () {
    console.log('Mute()');
    this.VideoElement.muted = !this.VideoElement.muted;
}

Player.prototype.ChangeVolume = function (action) {
    console.log('Vol()');

    var vol = this.VideoElement.volume;

    if (action == 'up' && vol < 1) {
        console.log('+');
        vol = this.VideoElement.volume + 0.1;
    } else if (action == 'down' && vol > 0) {
        console.log('-');
        vol = this.VideoElement.volume - 0.1
    }

    this.VideoElement.volume = vol.toPrecision(1);
    console.log('Volume = ' + this.VideoElement.volume.toString());
}

Player.prototype.GoFullscreen = function () {
    var player = document.querySelector("#webplayer");

    if (player.mozRequestFullScreen) {
        player.mozRequestFullScreen();
    } else if (player.webkitRequestFullScreen) {
        player.webkitRequestFullScreen();
    }
}

Player.prototype.GetParameters = function () {
    var qs = window.location.search;
    qs = qs.replace('?', '');

    this.Autoplay = qs.contains("autoplay");
    this.StartTime = qs.split('t=')[1];
}

/*
* Player Events
*/

Player.prototype.ConfigureEvents = function () {
    this.VideoElement.addEventListener('onplaying', this.OnPlaying, false);
    this.VideoElement.addEventListener('loadedmetadata', this.LoadedMetaData, false);
}

Player.prototype.OnPlaying = function () {
    console.log('OnPlaying...');
}

Player.prototype.LoadedMetaData = function () {
    console.log('LoadedMetaData()');
    document.querySelector("#video").currentTime = window.location.search.split('t=')[1];
    document.querySelector("#video").play();
}