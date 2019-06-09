<script>
    import { overdue, completed } from './stores.js';
    import { createEventDispatcher, onDestroy } from 'svelte';
    import { fade } from 'svelte/transition';

    export let num;
    export let description;
    export let dueDate;
    let _completed = false;
    
    const dispatch = createEventDispatcher();
</script>
<style>
._completed {
		text-decoration: line-through;
	}
</style>
{#if 
    !(($completed && !_completed) || 
      ($overdue && new Date(dueDate).getTime() >= Date.now())
     )
}
<li in:fade out:fade class:_completed>
    Task {num}: {description} - Due on {dueDate}
    <input type="checkbox" bind:checked={_completed} />
    <button on:click="{() => dispatch('remove', null)}">Remove</button>
</li>
{/if}