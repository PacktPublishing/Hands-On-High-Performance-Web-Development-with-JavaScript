<script>
    import { weather } from './stores.js';
</script>
<style>
    dt {
        font-weight : bold;
    }
</style>
<div>
    {#if $weather.error }
        <p>There was an error getting your data!</p>
    {:else if $weather.data }
        <dl>
            <dt>Conditions</dt>
            <dd>{$weather.weather}</dd>
            <dt>Temperature</dt>
            <dd>{$weather.temperature.current}</dd>
            <dd>{$weather.temperature.min}</dd>
            <dd>{$weather.temperature.max}</dd>
            <dt>Humidity</dt>
            <dd>{$weather.humidity}</dd>
            <dt>Sunrise</dt>
            <dd>{$weather.sunrise}</dd>
            <dt>Sunset</dt>
            <dd>{$weather.sunset}</dd>
            <dt>Windspeed</dt>
            <dd>{$weather.windspeed}</dd>
            <dt>Direction</dt>
            <dd>{$weather.direction}</dd>
        </dl>
    {:else}
        <p>No city or zipcode has been submitted!</p>
    {/if}
</div>