<script>
    import { zipcode, weather, metric } from './stores.js';
    import Dropdown from './Dropdown.svelte';
    
    let city = null;
    let zip = null;
    let country_code = null;

    const submitData = function() {
        weather.gather(country_code, $zipcode, $metric, zip, city);
    }

</script>
<style>
    
    input {
        margin-left: 10px;
    }
    label {
        display : inline-block;
    }
</style>
<div>
    <label>Zipcode?<input type="checkbox" bind:checked={$zipcode} /></label>
    {#if $zipcode}
    <label>Zip<Dropdown name="zip" type="number" bind:value={zip} minLength="6" maxLength="9"></Dropdown></label>
    {:else}
    <label>City<Dropdown name="city" bind:value={city}></Dropdown></label>
    {/if}
    <label id="cc">Country Code<Dropdown name="cc" bind:value={country_code} minLength="2" maxLength="2"></Dropdown></label>
    <label>Metric?<input type="checkbox" bind:checked={$metric} /></label>
    <button on:click={submitData}>Check</button>
</div>