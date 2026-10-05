import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';

// Screen components are lazy-loaded, exactly like the CRA bundle splitting by route.
export default createRouter({
	history: createWebHashHistory(),
	routes: [
		{ path: '/', redirect: '/hud' },
		{ path: '/hud', component: () => import('@/components/HUD/index.vue') },
		{ path: '/auth', component: () => import('@/components/Auth/index.vue') },
		{ path: '/daily', component: () => import('@/components/Daily/index.vue') },
		{ path: '/character', component: () => import('@/components/Character/index.vue') },
		{ path: '/spawn', component: () => import('@/components/Spawn/index.vue') },
		{ path: '/phone', component: () => import('@/components/Phone/index.vue') },
		{ path: '/inventory', component: () => import('@/components/Inventory/index.vue') },
		{ path: '/house', component: () => import('@/components/House/index.vue') },
		{ path: '/business', component: () => import('@/components/Business/index.vue') },
		{ path: '/dialog', component: () => import('@/components/Dialog/index.vue') },
		{ path: '/job', component: () => import('@/components/Job/index.vue') },
		{ path: '/admin', component: () => import('@/components/Admin/index.vue') },

		// Player
		{ path: '/player/passport', component: () => import('@/components/Player/passport.vue') },
		{ path: '/player/licenses', component: () => import('@/components/Player/licenses.vue') },
		{ path: '/player/death', component: () => import('@/components/Player/death.vue') },

		// Services
		{ path: '/gas', component: () => import('@/components/Services/gas/index.vue') },
		{ path: '/supermarket', component: () => import('@/components/Services/supermarket/index.vue') },
		{ path: '/licenses', component: () => import('@/components/Services/licenses/index.vue') },
		{ path: '/vehicle_shop', component: () => import('@/components/Services/vehicle-shop/index.vue') },
		{ path: '/weapons', component: () => import('@/components/Services/weapons/index.vue') },
		{ path: '/lsc', component: () => import('@/components/Services/lsc/index.vue') },
		{ path: '/clothing_shop', component: () => import('@/components/Services/clothing-shop/index.vue') },
		{ path: '/tattoo_shop', component: () => import('@/components/Services/tattoo-shop/index.vue') },
		{ path: '/barbershop', component: () => import('@/components/Services/barbershop/index.vue') },
		{ path: '/surgeon', component: () => import('@/components/Services/surgeon/index.vue') },
		{ path: '/passport', component: () => import('@/components/Services/passport/index.vue') },
		{ path: '/bank', component: () => import('@/components/Services/bank/index.vue') },
		{ path: '/vehicle_dump', component: () => import('@/components/Services/vehicle-dump/index.vue') },

		// Games
		{ path: '/games/lockpick', component: () => import('@/components/Games/Lockpick/index.vue') },

		// Trading
		{ path: '/trading/vehicle', component: () => import('@/components/Trading/vehicle/index.vue') },
		{ path: '/trading/house', component: () => import('@/components/Trading/house/index.vue') },
		{ path: '/trading/business', component: () => import('@/components/Trading/business/index.vue') },

		// Factions
		{ path: '/factions/docs', component: () => import('@/components/Factions/docs/index.vue') },
		{ path: '/factions/garage', component: () => import('@/components/Factions/garage/index.vue') },
		{ path: '/factions/tablet', component: () => import('@/components/Tablet/index.vue') },
		{ path: '/factions/wardrobe', component: () => import('@/components/Factions/wardrobe/index.vue') },
		{ path: '/factions/workshop', component: () => import('@/components/Factions/workshop/index.vue') }
	] as RouteRecordRaw[]
});
