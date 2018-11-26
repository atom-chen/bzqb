import Cache from "./Cache";

interface SE {
    bgmVolume: number,
    bgmEnable: boolean,
    soundVolume: number,
    soundEnable: boolean
}

export default class Audio {
    //单例处理
    private static _instance: Audio = new Audio();
    public static getInstance(): Audio {
        return Audio._instance;
    }
    public _audioState: SE;
    private _curBgm: number = null;
    private _curBgmPath: cc.AudioClip = null;
    private _curSoundEffect: number = null;
    constructor() {
        this._audioState = Cache.getInstance().getItem("AudioSE") || { bgmVolume: 1, bgmEnable: true, soundVolume: 1, soundEnable: true };
    }

    public getAudioState(): SE {
        return this._audioState;
    }

    public playBgm(bgm: cc.AudioClip): void {
        if (!this._audioState.bgmEnable) return;
        if (this._curBgm != null) this.stopCurBgm();
        this._curBgmPath = bgm;
        this._curBgm = cc.audioEngine.play(bgm, true, this._audioState.bgmVolume);
    }

    public stopCurBgm(): void {
        if (this._curBgm != null) {
            cc.audioEngine.stop(this._curBgm);
        } else {
            cc.audioEngine.stopAll();
        }
        this._curBgm = null;
    }

    public closeBgm(): void {
        this._audioState.bgmEnable = false;
        this.stopCurBgm();
        this._saveAudioSE();
    }

    public openBgm(): void {
        this._audioState.bgmEnable = true;
        this.playBgm(this._curBgmPath);
        this._saveAudioSE();
    }

    public setBgmVolume(volume: number): void {
        this._audioState.bgmVolume = volume;
        cc.audioEngine.setVolume(this._curBgm, this._audioState.bgmVolume);
        this._saveAudioSE();
    }

    public playSoundEffect(audio: cc.AudioClip): number {
        if (!this._audioState.soundEnable) return null;
        this._curSoundEffect = cc.audioEngine.play(audio, false, this._audioState.soundVolume);
        return this._curSoundEffect;
    }

    public stopSoundEffect(audioId?: number) {
        if (typeof audioId !== "undefined") {
            cc.audioEngine.stop(audioId);
        } else {
            if (this._curSoundEffect != null) {
                cc.audioEngine.stop(this._curSoundEffect);
                this._curSoundEffect = null;
            }
        }
    }

    public openSoundEffect(): void {
        this._audioState.soundEnable = true;
        this._saveAudioSE();
    }

    public closeSoundEffect(): void {
        this._audioState.soundEnable = false;
        this.stopSoundEffect();
        this._saveAudioSE();
    }

    public setSoundEffectVolume(volume: number): void {
        this._audioState.soundVolume = volume;
        cc.audioEngine.setVolume(this._curSoundEffect, this._audioState.soundVolume);
        this._saveAudioSE();
    }

    public stopAllAudio(): void {
        cc.audioEngine.stopAll();
        this._curBgm = null;
        this._curSoundEffect = null;
    }

    private _saveAudioSE(): void {
        Cache.getInstance().setItem("AudioSE", this._audioState);
    }
}