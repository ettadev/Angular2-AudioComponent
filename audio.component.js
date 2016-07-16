"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var AudioComponent = (function () {
    function AudioComponent() {
        /** Display or not the controls, default: true */
        this.controls = true;
        /** Set autoplay status, default true. */
        this.autoplay = true;
        /** Set loop status, default false. */
        this.loop = false;
        /** Set the volume, default: 1 (max). */
        this.volume = 1;
        /** Set the start index of the playlist. */
        this.startPosition = 0;
        /** Number in s, in order to start the transition, default: 5s */
        this.transition = 5;
        /** Interval in order to set the audio transition, in ms, default: 500ms. */
        this.intervalTransition = 500;
        /** Define if transition, default: false. */
        this.transition = false;
        /** Define the preload status, default metadata. */
        this.preload = 'metadata';
        /** Define the mute status, default false. */
        this.muted = false;
        /**
         * Custom events who could be intercepted.
         * @type {EventEmitter}
         */
        /** Emit the playlist. */
        this.playlist = new core_1.EventEmitter();
        /** Emit informations on the current video. */
        this.current = new core_1.EventEmitter();
        /** Emit the progress status of audio dowloading. */
        this.progress = new core_1.EventEmitter();
        /** Emit downloading status of track. */
        this.downloading = new core_1.EventEmitter();
    }
    AudioComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        if (this.transition)
            this.player.nativeElement.addEventListener('play', function () { return _this.audioTransition(_this.player.nativeElement.duration, _this.player.nativeElement.currentTime); });
        this.player.nativeElement.addEventListener('ended', function () {
            _this.player.nativeElement.volume = _this.volume;
            /** Increment array position in order to get next audio track. */
            _this.startPosition += 1;
            /** If loop is true && startPosition is at last index then reset the playlist. */
            if (_this.startPosition >= _this.src.length && _this.loop)
                _this.startPosition = 0;
            /** Else stop the playlist. */
            if (_this.startPosition >= _this.src.length && !_this.loop)
                return;
            /** Set new src track */
            _this.player.nativeElement.src = _this.src[_this.startPosition];
            /** If onChangeTrack is set, then emit the new track. */
        });
        this.player.nativeElement.addEventListener('loadstart', function () { return _this.emitCurrentTrack(); });
        this.player.nativeElement.addEventListener('pause', function () {
            /** Reset Timeout && Interval. */
            window.clearTimeout(_this.timeout);
            window.clearInterval(_this.interval);
        });
        this.player.nativeElement.addEventListener('progress', function (data) { return _this.downloading.emit(true); });
    };
    /** Set programmatically audio controls. */
    AudioComponent.prototype.play = function () {
        this.player.nativeElement.play();
    };
    AudioComponent.prototype.pause = function () {
        this.player.nativeElement.pause();
    };
    AudioComponent.prototype.muteVideo = function () {
        this.player.nativeElement.muted = !this.player.nativeElement.muted;
    };
    AudioComponent.prototype.previousTrack = function () {
        /** If first track, then do nothing. */
        if (this.src.indexOf(this.player.nativeElement.src) <= 0)
            return;
        /** Else go back to previous element in track's array. */
        this.player.nativeElement.src = this.src[this.src.indexOf(this.player.nativeElement.src) - 1];
    };
    AudioComponent.prototype.nextTrack = function () {
        /** If last track, then do nothing. */
        if (this.src.indexOf(this.player.nativeElement.src) >= this.src.length - 1)
            return;
        /** Else, go to the next element in track's array. */
        this.player.nativeElement.src = this.src[this.src.indexOf(this.player.nativeElement.src) + 1];
    };
    /** Audio Transitions */
    /** Set transition audio. */
    AudioComponent.prototype.audioTransition = function (trackDuration, timeElapsed) {
        if (timeElapsed === void 0) { timeElapsed = 0; }
        /** Clear setInterval if defined. */
        window.clearInterval(this.interval);
        /** Check the currentTime elapsed, then set transition if defined. */
        this.timeout = this.setTimeoutDelay(trackDuration, timeElapsed);
    };
    AudioComponent.prototype.setTimeoutDelay = function (trackDuration, timeElapsed) {
        var _this = this;
        return setTimeout(function () {
            _this.interval = _this.setTransitionInterval(_this.intervalTransition);
        }, (trackDuration - timeElapsed) * 1000 - (this.transition * 1000));
    };
    AudioComponent.prototype.setTransitionInterval = function (interval) {
        var _this = this;
        return setInterval(function () {
            _this.player.nativeElement.volume -= (_this.player.nativeElement.volume * 10) / 100;
        }, interval);
    };
    /**
     * Emitters
     */
    AudioComponent.prototype.emitPlayList = function () {
        this.playlist.emit(this.src);
    };
    AudioComponent.prototype.emitCurrentTrack = function () {
        /**
         * Return an object who will contain: Url of the track, duration, textTrack, volume)
         */
        this.current.emit({
            src: this.player.nativeElement.currentSrc,
            textTracks: this.player.nativeElement.textTracks,
            volume: this.player.nativeElement.volume
        });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], AudioComponent.prototype, "src", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], AudioComponent.prototype, "controls", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], AudioComponent.prototype, "autoplay", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], AudioComponent.prototype, "loop", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], AudioComponent.prototype, "volume", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], AudioComponent.prototype, "startPosition", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], AudioComponent.prototype, "transition", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], AudioComponent.prototype, "intervalTransition", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], AudioComponent.prototype, "transition", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], AudioComponent.prototype, "preload", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], AudioComponent.prototype, "muted", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], AudioComponent.prototype, "playlist", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], AudioComponent.prototype, "current", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], AudioComponent.prototype, "progress", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], AudioComponent.prototype, "downloading", void 0);
    __decorate([
        core_1.ViewChild('audioplayer'), 
        __metadata('design:type', Object)
    ], AudioComponent.prototype, "player", void 0);
    AudioComponent = __decorate([
        core_1.Component({
            selector: 'audio-component',
            moduleId: module.id,
            templateUrl: './audio.template.html',
            directives: [common_1.NgIf]
        }), 
        __metadata('design:paramtypes', [])
    ], AudioComponent);
    return AudioComponent;
}());
exports.AudioComponent = AudioComponent;
//# sourceMappingURL=audio.component.js.map