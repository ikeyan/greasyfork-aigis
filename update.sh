if [[ $1 != --pulled ]]; then
    git pull
    bash "$0" --pulled "$@"
    exit
fi
shift

generate() {
    NEW_VERSION=$(node -e 'console.log(require("./package.json").version)')
    (cat <<JS
// ==UserScript==
// @name         千年戦争アイギス・御城プロジェクト:RE 隠れてる時ミュート
// @namespace    https://greasyfork.org/users/5795-ikeyan
// @version      $NEW_VERSION
// @description  タブが隠れてる時やウィンドウが最小化しているときに消音します。
// @author       ikeyan
$(node generate-aigis-matches.js)
// @match        http://assets.shiropro-re.net/html/Oshiro.html
// @grant        none
// @run-at       document-start
// ==/UserScript==

$(cat body.js)
JS
    ) > index-new.js
}

set -x
npm install
generate
if ! diff -q index.js index-new.js; then
    echo diff exists
    CURRENT_VERSION=$(grep '//\s*@version\b' index.js | head -1 | sed -Ee 's#^.*@version\s*##')
    if [ $CURRENT_VERSION = $NEW_VERSION ]; then
        echo "bump version"
        npm version --no-git-tag-version -f patch
        echo "regenerate"
        generate
    fi
    diff --color index.js index-new.js
    mv index-new.js index.js
    git add index.js package.json package-lock.json
    git commit -m "Updated index.js to v$NEW_VERSION"
    git tag "v$NEW_VERSION"
    git push
    git push --tags
fi
