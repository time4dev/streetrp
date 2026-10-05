// Registers all server->browser RPC handlers that feed the Pinia stores.
// Mirrors the legacy store/*/events.ts modules.
import rpc from '@/utils/rpc';
import { useAppStore } from './app';
import { useHudStore } from './hud';
import { usePlayerStore } from './player';
import { usePhoneStore } from './phone';

// App
rpc.register('App-SetDate', (date: string) => useAppStore().setDate(date));
rpc.register('App-SetOnline', (count: number) => useAppStore().setOnline(count));

// HUD
rpc.register('HUD-SetVisible', (state: boolean) => useHudStore().setVisible(state));
rpc.register('HUD-SetCapture', (data: any) => useHudStore().setCapture(data));

// Player
rpc.register('Player-SetSatiety', (value: number) => usePlayerStore().setSatiety(value));
rpc.register('Player-SetMoney', (money: any) => usePlayerStore().setMoney(money));
rpc.register('Player-SetTasks', (list: string[]) => usePlayerStore().setTasks(list));
rpc.register('Player-SetId', (id: number) => usePlayerStore().setId(id));
rpc.register('Player-SetBonus', (time: number) => usePlayerStore().setBonus(time));

// Phone
rpc.register('Phone-IncomingCall', (phoneNumber: string) => {
	usePhoneStore().setCall({
		type: 'incoming',
		phoneNumber
	});
});
rpc.register('Phone-AcceptCall', () => usePhoneStore().acceptCall());
rpc.register('Phone-DeclineCall', () => usePhoneStore().setCall());
rpc.register('Phone-SetWallpaper', (name: string) => usePhoneStore().setWallpaper(name));
