(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/modules/Audio.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '17c09VWCPVIza/28Cp3XQng', 'Audio', __filename);
// framework/modules/Audio.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Cache_1 = require("./Cache");
var Audio = /** @class */ (function () {
    function Audio() {
        this._curBgm = null;
        this._curBgmPath = null;
        this._curSoundEffect = null;
        this._audioState = Cache_1.default.getInstance().getItem("AudioSE") || { bgmVolume: 1, bgmEnable: true, soundVolume: 1, soundEnable: true };
    }
    Audio.getInstance = function () {
        return Audio._instance;
    };
    Audio.prototype.getAudioState = function () {
        return this._audioState;
    };
    Audio.prototype.playBgm = function (bgm) {
        if (!this._audioState.bgmEnable)
            return;
        if (this._curBgm != null)
            this.stopCurBgm();
        this._curBgmPath = bgm;
        this._curBgm = cc.audioEngine.play(bgm, true, this._audioState.bgmVolume);
    };
    Audio.prototype.stopCurBgm = function () {
        if (this._curBgm != null) {
            cc.audioEngine.stop(this._curBgm);
        }
        else {
            cc.audioEngine.stopAll();
        }
        this._curBgm = null;
    };
    Audio.prototype.closeBgm = function () {
        this._audioState.bgmEnable = false;
        this.stopCurBgm();
        this._saveAudioSE();
    };
    Audio.prototype.openBgm = function () {
        this._audioState.bgmEnable = true;
        this.playBgm(this._curBgmPath);
        this._saveAudioSE();
    };
    Audio.prototype.setBgmVolume = function (volume) {
        this._audioState.bgmVolume = volume;
        cc.audioEngine.setVolume(this._curBgm, this._audioState.bgmVolume);
        this._saveAudioSE();
    };
    Audio.prototype.playSoundEffect = function (audio) {
        if (!this._audioState.soundEnable)
            return null;
        this._curSoundEffect = cc.audioEngine.play(audio, false, this._audioState.soundVolume);
        return this._curSoundEffect;
    };
    Audio.prototype.stopSoundEffect = function (audioId) {
        if (typeof audioId !== "undefined") {
            cc.audioEngine.stop(audioId);
        }
        else {
            if (this._curSoundEffect != null) {
                cc.audioEngine.stop(this._curSoundEffect);
                this._curSoundEffect = null;
            }
        }
    };
    Audio.prototype.openSoundEffect = function () {
        this._audioState.soundEnable = true;
        this._saveAudioSE();
    };
    Audio.prototype.closeSoundEffect = function () {
        this._audioState.soundEnable = false;
        this.stopSoundEffect();
        this._saveAudioSE();
    };
    Audio.prototype.setSoundEffectVolume = function (volume) {
        this._audioState.soundVolume = volume;
        cc.audioEngine.setVolume(this._curSoundEffect, this._audioState.soundVolume);
        this._saveAudioSE();
    };
    Audio.prototype.stopAllAudio = function () {
        cc.audioEngine.stopAll();
        this._curBgm = null;
        this._curSoundEffect = null;
    };
    Audio.prototype._saveAudioSE = function () {
        Cache_1.default.getInstance().setItem("AudioSE", this._audioState);
    };
    //单例处理
    Audio._instance = new Audio();
    return Audio;
}());
exports.default = Audio;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=Audio.js.map
        