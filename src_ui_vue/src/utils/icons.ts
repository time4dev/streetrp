/**
 * Self-contained icon set for the UI.
 *
 * Replaces the icons auto-generated from the legacy React project:
 * every entry is a hand-picked analog redrawn in Lucide style
 * (https://lucide.dev, ISC license), rendered as inline SVG on a 24x24 grid.
 * Stroke-based and inherits `currentColor`, so the `color` / `size` props
 * and CSS keep working as before.
 */
import { h, type FunctionalComponent } from 'vue';

type IconProps = {
	size?: string | number;
	color?: string;
	className?: string;
	style?: Record<string, unknown>;
	title?: string;
};

function createIcon(markup: string): FunctionalComponent<IconProps> {
	return (props, { attrs }) => {
		const { size = '1em', color, className, style, title } = props ?? {};

		return h('svg', {
			viewBox: '0 0 24 24',
			xmlns: 'http://www.w3.org/2000/svg',
			fill: 'none',
			stroke: 'currentColor',
			strokeWidth: 2,
			strokeLinecap: 'round',
			strokeLinejoin: 'round',
			height: size,
			width: size,
			class: className,
			style: { color, ...style },
			innerHTML: title ? `<title>${title}</title>${markup}` : markup,
			...(attrs as Record<string, unknown>)
		});
	};
}

/*
 * Analogs of the legacy icons:
 *   FaChevronCircleLeft/Right  -> circle-chevron-left/right
 *   FaChevronLeft/Right        -> chevron-left/right
 *   FaGasPump                  -> fuel
 *   FaHamburger                -> sandwich
 *   FaPlus / FaMinus           -> plus / minus
 *   FaRegClock                 -> clock
 *   FaRegStar / FaStar         -> star (outline / filled)
 *   FaUniversity               -> landmark
 *   FaWeightHanging            -> weight
 *   IoAlbums                   -> archive
 *   IoBatteryFull              -> battery-full
 *   IoCall / IoIosCall         -> phone-call / phone
 *   IoCar                      -> car
 *   IoCellular                 -> signal
 *   IoClose / IoIosClose       -> x
 *   IoIosCloseCircle           -> circle-x
 *   IoImages                   -> images
 *   IoIosAdd                   -> plus
 *   IoIosAlarm                 -> alarm-clock
 *   IoIosArrowBack/Forward     -> chevron-left/right
 *   IoIosBackspace             -> delete
 *   IoIosCheckmarkCircleOutline-> circle-check
 *   IoIosContact               -> circle-user-round
 *   IoIosEye / IoIosEyeOff     -> eye / eye-off
 *   IoIosKeypad                -> grip
 *   IoIosLock / IoIosUnlock    -> lock / lock-open
 *   IoIosMail                  -> mail
 *   IoIosMic / IoIosMicOff     -> mic / mic-off
 *   IoIosPeople / IoPeople     -> users
 *   IoIosPerson                -> user
 *   IoIosSearch                -> search
 *   IoIosSend                  -> send
 *   IoIosText                  -> message-square
 *   IoLayers                   -> layers
 *   IoLibrary                  -> library
 *   IoMedical                  -> cross
 *   IoNavigateOutline          -> navigation
 *   IoServer                   -> server
 *   IoSettings                 -> settings
 *   IoShield                   -> shield
 *   IoStar                     -> star (filled)
 *   IoWallet                   -> wallet
 *   IoWifi                     -> wifi
 *   MdCheck                    -> check
 */

// FontAwesome analogs
export const FaChevronCircleLeft = createIcon('<circle cx="12" cy="12" r="10" /><path d="m14 16-4-4 4-4" />');
export const FaChevronCircleRight = createIcon('<circle cx="12" cy="12" r="10" /><path d="m10 8 4 4-4 4" />');
export const FaChevronLeft = createIcon('<path d="m15 18-6-6 6-6" />');
export const FaChevronRight = createIcon('<path d="m9 18 6-6-6-6" />');
export const FaGasPump = createIcon('<path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 4 0v-6.998a2 2 0 0 0-.59-1.42L18 5" /><path d="M14 21V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16" /><path d="M2 21h13" /><path d="M3 9h11" />');
export const FaHamburger = createIcon('<path d="m2.37 11.223 8.372-6.777a2 2 0 0 1 2.516 0l8.371 6.777" /><path d="M21 15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-5.25" /><path d="M3 15a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h9" /><path d="m6.67 15 6.13 4.6a2 2 0 0 0 2.8-.4l3.15-4.2" /><rect width="20" height="4" x="2" y="11" rx="1" />');
export const FaMinus = createIcon('<path d="M5 12h14" />');
export const FaPlus = createIcon('<path d="M5 12h14" /><path d="M12 5v14" />');
export const FaRegClock = createIcon('<circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />');
export const FaRegStar = createIcon('<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />');
export const FaStar = createIcon('<path fill="currentColor" d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />');
export const FaUniversity = createIcon('<path d="M10 18v-7" /><path d="M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z" /><path d="M14 18v-7" /><path d="M18 18v-7" /><path d="M3 22h18" /><path d="M6 18v-7" />');
export const FaWeightHanging = createIcon('<circle cx="12" cy="5" r="3" /><path d="M6.5 8a2 2 0 0 0-1.905 1.46L2.1 18.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.925-2.54L19.4 9.5A2 2 0 0 0 17.48 8Z" />');

// Ionicons / Material analogs
export const IoAlbums = createIcon('<rect width="20" height="5" x="2" y="3" rx="1" /><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" /><path d="M10 12h4" />');
export const IoBatteryFull = createIcon('<path d="M10 10v4" /><path d="M14 10v4" /><path d="M22 14v-4" /><path d="M6 10v4" /><rect x="2" y="6" width="16" height="12" rx="2" />');
export const IoCall = createIcon('<path d="M13 2a9 9 0 0 1 9 9" /><path d="M13 6a5 5 0 0 1 5 5" /><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />');
export const IoCar = createIcon('<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" />');
export const IoCellular = createIcon('<path d="M2 20h.01" /><path d="M7 20v-4" /><path d="M12 20v-8" /><path d="M17 20V8" /><path d="M22 4v16" />');
export const IoClose = createIcon('<path d="M18 6 6 18" /><path d="m6 6 12 12" />');
export const IoImages = createIcon('<path d="m22 11-1.296-1.296a2.4 2.4 0 0 0-3.408 0L11 16" /><path d="M4 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2" /><circle cx="13" cy="7" r="1" fill="currentColor" /><rect x="8" y="2" width="14" height="14" rx="2" />');
export const IoIosAdd = createIcon('<path d="M5 12h14" /><path d="M12 5v14" />');
export const IoIosAlarm = createIcon('<circle cx="12" cy="13" r="8" /><path d="M12 9v4l2 2" /><path d="M5 3 2 6" /><path d="m22 6-3-3" /><path d="M6.38 18.7 4 21" /><path d="M17.64 18.67 20 21" />');
export const IoIosArrowBack = createIcon('<path d="m15 18-6-6 6-6" />');
export const IoIosArrowForward = createIcon('<path d="m9 18 6-6-6-6" />');
export const IoIosBackspace = createIcon('<path d="M10 5a2 2 0 0 0-1.344.519l-6.328 5.74a1 1 0 0 0 0 1.481l6.328 5.741A2 2 0 0 0 10 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z" /><path d="m12 9 6 6" /><path d="m18 9-6 6" />');
export const IoIosCall = createIcon('<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />');
export const IoIosCheckmarkCircleOutline = createIcon('<circle cx="12" cy="12" r="10" /><path d="m16 9-5.5 5.5L8 12" />');
export const IoIosClose = createIcon('<path d="M18 6 6 18" /><path d="m6 6 12 12" />');
export const IoIosCloseCircle = createIcon('<circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" />');
export const IoIosContact = createIcon('<path d="M17.925 20.056a6 6 0 0 0-11.851.001" /><circle cx="12" cy="11" r="4" /><circle cx="12" cy="12" r="10" />');
export const IoIosEye = createIcon('<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" />');
export const IoIosEyeOff = createIcon('<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" /><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" /><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" /><path d="m2 2 20 20" />');
export const IoIosKeypad = createIcon('<circle cx="12" cy="5" r="1" /><circle cx="19" cy="5" r="1" /><circle cx="5" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /><circle cx="12" cy="19" r="1" /><circle cx="19" cy="19" r="1" /><circle cx="5" cy="19" r="1" />');
export const IoIosLock = createIcon('<rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />');
export const IoIosMail = createIcon('<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /><rect x="2" y="4" width="20" height="16" rx="2" />');
export const IoIosMic = createIcon('<path d="M12 19v3" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><rect x="9" y="2" width="6" height="13" rx="3" />');
export const IoIosMicOff = createIcon('<path d="M12 19v3" /><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33" /><path d="M16.95 16.95A7 7 0 0 1 5 12v-2" /><path d="M18.89 13.23A7 7 0 0 0 19 12v-2" /><path d="m2 2 20 20" /><path d="M9 9v3a3 3 0 0 0 5.12 2.12" />');
export const IoIosPeople = createIcon('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><path d="M16 3.128a4 4 0 0 1 0 7.744" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><circle cx="9" cy="7" r="4" />');
export const IoIosPerson = createIcon('<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />');
export const IoIosSearch = createIcon('<path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" />');
export const IoIosSend = createIcon('<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" /><path d="m21.854 2.147-10.94 10.939" />');
export const IoIosText = createIcon('<path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />');
export const IoIosUnlock = createIcon('<rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" />');
export const IoLayers = createIcon('<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" /><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" /><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />');
export const IoLibrary = createIcon('<path d="m16 6 4 14" /><path d="M12 6v14" /><path d="M8 8v12" /><path d="M4 4v16" />');
export const IoMedical = createIcon('<path d="M4 9a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h4a1 1 0 0 1 1 1v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-4a1 1 0 0 1 1-1h4a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-4a1 1 0 0 1-1-1V4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4a1 1 0 0 1-1 1z" />');
export const IoMic = createIcon('<path d="M12 19v3" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><rect x="9" y="2" width="6" height="13" rx="3" />');
export const IoNavigateOutline = createIcon('<polygon points="3 11 22 2 13 21 11 13 3 11" />');
export const IoPeople = createIcon('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><path d="M16 3.128a4 4 0 0 1 0 7.744" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><circle cx="9" cy="7" r="4" />');
export const IoServer = createIcon('<rect width="20" height="8" x="2" y="2" rx="2" ry="2" /><rect width="20" height="8" x="2" y="14" rx="2" ry="2" /><line x1="6" x2="6.01" y1="6" y2="6" /><line x1="6" x2="6.01" y1="18" y2="18" />');
export const IoSettings = createIcon('<path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" /><circle cx="12" cy="12" r="3" />');
export const IoShield = createIcon('<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />');
export const IoStar = createIcon('<path fill="currentColor" d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />');
export const IoWallet = createIcon('<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" /><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />');
export const IoWifi = createIcon('<path d="M12 20h.01" /><path d="M2 8.82a15 15 0 0 1 20 0" /><path d="M5 12.859a10 10 0 0 1 14 0" /><path d="M8.5 16.429a5 5 0 0 1 7 0" />');

// Material analogs
export const MdCheck = createIcon('<path d="M20 6 9 17l-5-5" />');

/** Type compatible with react-icons IconType (for props typed as IconType) */
export type IconType = FunctionalComponent<IconProps>;
