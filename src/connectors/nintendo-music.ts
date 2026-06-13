import connectors from "../core/connectors";

export {};

Connector.onReady = Connector.onStateChanged

var audio: (HTMLAudioElement | null);

function bindStuffIDK(element: (HTMLAudioElement | null)) {
	if (!element || element === audio) {
		return;
	}

	for (const event of ['playing', 'pause', 'timeupdate']) {
		element.addEventListener(event, Connector.onStateChanged);
	}
	audio = element;
}

// 100% necessary dude
(() => {
	// copied from https://github.com/Bentheminernz/Nintendo-Music-RPC/blob/be4f5ae5edad1122332fb7274c368a4702edca09/extension/content-script.js#L21-L24
	const observer = new MutationObserver(() => {
		const el = document.querySelector('audio');

		if (el && el !== audio) {
			bindStuffIDK(el);
		}
	});
	
	observer.observe(document.body, { childList: true, subtree: true });
	bindStuffIDK(document.querySelector('audio'));
})();

Connector.getTrack = () => navigator.mediaSession?.metadata?.title;
Connector.getArtist = () => (navigator.mediaSession?.metadata?.artist || 'Nintendo Co., Ltd.');
Connector.getAlbum = () => navigator.mediaSession?.metadata?.album;

// copied from youtube-music.ts :p
Connector.getTrackArt = () => {
	const artworks = navigator.mediaSession?.metadata?.artwork;
	return artworks?.[artworks.length - 1].src;
};

// modified from 9sky.ts :)
Connector.getTimeInfo = () => {
   const media = Util.queryElements('audio')?.[0] as HTMLMediaElement;
   let duration = media?.duration;
   let currentTime = media?.currentTime;
   
	return { duration, currentTime };
}

// modified from 9sky.ts :v
Connector.isPlaying = () => {
	const media = Util.queryElements('audio')?.[0] as HTMLMediaElement;
	return Boolean(media?.currentTime && !media.paused && !media.ended);
};
