if [[ $1 != --pulled ]]; then
    git pull
    bash "$0" --pulled "$@"
    exit
fi
shift

npm install --no-package-lock

(cd 33741; bash update.sh "$@")

