import type { InjectionKey } from 'vue';

// legacy Phone context (context.ts): openApp shared through React context
export interface PhoneContext {
	openApp: (name?: string) => void;
}

export const PHONE_CONTEXT = Symbol('PhoneContext') as InjectionKey<PhoneContext>;
