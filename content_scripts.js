let prefix = "chrome-extension-ytskip";

let get = (key) => {
    return window.localStorage.getItem(`${prefix}--${key}`)
}

let set = (key , value) => {
    return window.localStorage.setItem(`${prefix}--${key}`, value)
}

let params;
let prevVideoID;
let videoID;

let refreshParams = () => {
    let urlSearchParams = new URLSearchParams(window.location.search);
    params = Object.fromEntries(urlSearchParams.entries());
    videoID = window.location.pathname == "/watch" ? params.v : undefined;
};

let performCheck = () => {
    console.log(`Video ID: ${videoID}`);

    if (!videoID) {
        return;
    }

    let now = Date.now() / (1000 * 60);
    let lastViewed = get(`last-viewed-timestamp--${videoID}`);

    let delta = now - lastViewed;

    let frequency = 60 * 24 * 7;

    if (delta < frequency) {
        console.log("Video cannot be watched again");
        setTimeout(() => {
            let vid = document.querySelector("video");
            vid.currentTime = vid.duration - 3;
            console.log("Video has been ended!");
        }, 3000);
    } else {
        console.log("Video OK to watch :)");
        set(`last-viewed-timestamp--${videoID}`, `${now}`);
    }
}

let lastUrl = location.href;

new MutationObserver(() => {
    let url = location.href;
    if (url != lastUrl) {
        lastUrl = url;
        refreshParams();
        if (videoID !== prevVideoID) {
            prevVideoID = videoID;
            performCheck();
        }
    }
}).observe(document, { subtree: true, childList: true });

refreshParams();
performCheck();
