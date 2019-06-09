<script>
    import { weather } from './stores.js';
    import { onDestroy, onMount } from 'svelte';

    export let type = "text";
    export let name = "DEFAULT";
    export let value = null;
    export let required = true;
    export let minLength = 0;
    export let maxLength = 100000;
    let active = false;
    let inputs = [];
    let el;

    const unsubscribe = weather.subscribe(() => {
        if(!inputs.includes(value) ) {
            inputs = [...inputs, value];
            localStorage.setItem(name, inputs);
        }
        value = '';
    });
    const activate = function() {
        active = true;
    }
    const deactivate = function(ev) {
        if(!ev.path.includes(el) )
            active = false;
    }
    const add = function(ev) {
        value = ev.target.innerText;
        active = false;
    }
    const remove = function(ev) {
        const text = ev.target.parentNode.querySelector('span').innerText;
        const data = localStorage.getItem(name).split(',');
        data.splice(data.indexOf(text));
        inputs = [...data];
        localStorage.setItem(name, inputs);
    }
    onMount(() => {
            const data = localStorage.getItem(name);
            if( data === "" ) { inputs = []; }
            else { inputs = [...data.split(",")]; }
    });
    onDestroy(() => {
        unsubscribe();
    });
</script>
<style>
    input:valid {
        border: 1px solid #333;
    }
    input:invalid {
        border: 1px solid #c71e19;
    }
    div {
        position : relative;
    }
    ul {
        position : absolute;
        top : 100%;
        list-style-type : none;
        background : white;
        display : none;
    }
    li {
        cursor : hand;
        border-bottom : 1px solid black;
    }
    ul.active {
        display : inline-block;
    }
</style>
<svelte:window on:mousedown={deactivate} />
<div>
    {#if type === "text"}
        <input on:focus={activate} type="text" bind:value={value} {minLength} {maxLength} {required}/>
    {:else}
        <input on:focus={activate} type="number" bind:value={value} {minLength} {maxLength} {required}/>
    {/if}
    <ul class:active bind:this={el}>
        {#each inputs as input }
            <li><span on:click={add}>{input}</span> <button on:click={remove}>&times;</button></li>
        {/each}
    </ul>
</div>