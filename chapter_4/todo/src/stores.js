import { writable } from 'svelte/store';

export const overdue = writable(false);
export const completed = writable(false);