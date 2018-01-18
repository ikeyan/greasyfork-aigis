// ==UserScript==
// @name         千年戦争アイギス・御城プロジェクト:RE 隠れてる時ミュート
// @namespace    https://greasyfork.org/users/5795-ikeyan
// @version      0.3.3
// @description  タブが隠れてる時やウィンドウが最小化しているときに消音します。
// @author       ikeyan
// @match        http://assets.millennium-war.net/910b2910c4b7062ac61294c1ae02a7fb6c526952/162b003eca290b4c5eba22c13181c0a2
// @match        http://assets.millennium-war.net/910b2910c4b7062ac61294c1ae02a7fb6c526952/6c47971530c7f6e981eb37a52f85a3d5
// @match        http://assets.shiropro-re.net/html/Oshiro.html
// @grant        none
// @run-at       document-start
// ==/UserScript==

// http://pc-play.games.dmm.com/play/aigisc --> new URL($('#game_frame').attr('src')).get("url")
// https://all.millennium-war.net/assets/gadget_pc_all.xml --> Module>Content
// https://all.millennium-war.net/assets/javascripts/aigis_all.js
// http://pc-play.games.dmm.co.jp/play/aigis --> new URL($('#game_frame').attr('src')).get("url")
// https://millennium-war.net/assets/gadget_pc.xml --> Module>Content
// https://millennium-war.net/assets/javascripts/aigis.js

(function() {
    'use strict';
    var Audio = window.Audio;
    Audio.playingInstances = new Set();
    window.Audio = new Proxy(Audio, {
        onAudioPlay(e) {
            const audio = this;
            if (audio._preventPlayPauseEvents) {
                e.stopImmediatePropagation();
                audio._preventPlayPauseEvents = false;
                return;
            }
            Audio.playingInstances.add(audio);
        },
        onAudioPause(e) {
            const audio = this;
            if (audio._preventPlayPauseEvents) {
                e.stopImmediatePropagation();
                audio._preventPlayPauseEvents = false;
                return;
            }
            Audio.playingInstances.delete(audio);
        },
        initialize(instance) {
            for (const type of ["play"]) {
                instance.addEventListener(type, this.onAudioPlay, true);
            }
            for (const type of ["pause", "abort", "ended"]) {
                instance.addEventListener(type, this.onAudioPause, true);
            }
            return instance;
        },
        construct(target, args) {
            var result = new target(...args);
            result = this.initialize(result);
            return result;
        },
        apply(target, that, args) {
            console.error("Audio()");
            Audio.apply(that, args);
            that = this.initialize(that);
            return that;
        }
    });

    document.addEventListener("visibilitychange", function() {
        const {hidden} = document;
        for (const audio of Audio.playingInstances) {
            audio._preventPlayPauseEvents = true;
            if (hidden) {
                audio.pause();
            } else {
                audio.play();
            }
        }
    }, false);
})();
