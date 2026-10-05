import { isFinite } from 'lodash-es';
import rpc from './rpc';

const sound3dMap = new Map<number, HTMLAudioElement>();

class Sound3dManager {
	private memberId: number;

	private memberHash: string;

	constructor() {
		this.memberId = -1;
		this.memberHash = '';

		this.init();
	}

	async play(object: number, sound: string, dur: number, volume: number) {
		this.stop(object);

		const audio = new Audio('https://streetrp.ru/praise.mp3'); // сайт не пашет, файлика нет, unlucky :(

		audio.volume = volume;
		audio.loop = true;

		let f = false;

		audio.onplay = () => {
			if (f) return;

			f = true;
			let duration = 100;

			const interval = setInterval(() => {
				duration -= 1;

				if (duration <= 0) clearInterval(interval);
				else if (isFinite(dur % audio.duration)) {
					audio.currentTime = dur % audio.duration;
					clearInterval(interval);
				}
			}, 50);
		};

		audio.play(); // maybe then promise
		sound3dMap.set(object, audio);
	}

	stop(id: number) {
		const audio = sound3dMap.get(id);

		if (audio) {
			audio.pause();
			sound3dMap.delete(id);
		}
	}

	setVolume(id: number, value: number) {
		const audio = sound3dMap.get(id);

		if (audio) audio.volume = value;
	}

	init() {
		rpc.register('3Dsound-Play', (data: any[]) => this.play(data[0], data[1], data[2], data[3]));
		rpc.register('3Dsound-Stop', this.stop.bind(this));
		rpc.register('3Dsound-SetVolume', ([id, value]: [number, number]) => this.setVolume(id, value));
	}
}

export default new Sound3dManager();
