import { writable } from 'svelte/store';

export const todo_store = writable(new Set());