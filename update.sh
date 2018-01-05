cat <<JS
// ==UserScript==
// @name         千年戦争アイギス・御城プロジェクト:RE 隠れてる時ミュート
// @namespace   https://greasyfork.org/users/5795-ikeyan
// @version      $(cat version.txt)
// @description  タブが隠れてる時やウィンドウが最小化しているときに消音します。
// @author       ikeyan
// @match        http://assets.millennium-war.net/87e460b15025198b3551caa2beb66866108f5747/1ac385b3a7c489ee00e022824a3972ac
// @match        http://assets.millennium-war.net/87e460b15025198b3551caa2beb66866108f5747/9602b5e3050180f4a828c0db76d66a80
// @match        http://assets.shiropro-re.net/html/Oshiro.html
// @grant        none
// @run-at       document-start
// ==/UserScript==

$(cat body.js)
JS
