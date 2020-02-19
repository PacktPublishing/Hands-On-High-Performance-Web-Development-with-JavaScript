import { writable } from 'svelte/store';

function createWeather() {
    const { subscribe, update} = writable({});

    const api_key = '79181f5439884711cf5ada2867e73c8a'

    return {
        subscribe,
        gather: (cc, _z, _m, zip=null, city=null) => {
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${_z ? zip : city},${cc}&appid=${api_key}&units=${_m ? 'metric' : 'imperial'}`)
            .then(res => res.json())
            .then(final => update(() => { 
                    const sr = new Date(final.sys.sunrise);
                    const ss = new Date(final.sys.sunset);
                    return {
                        data : true,
                        msg : final.weather[0].description,
                        weather : final.weather[0].main,
                        temperature : {
                            current : final.main.temp,
                            min : final.main.temp_min,
                            max : final.main.temp_max
                        },
                        humidity : `${final.main.humidity}%`,
                        sunrise : `${sr.getHours() + 1}:${sr.getMinutes()}:${sr.getSeconds()}`,
                        sunset : `${ss.getHours() + 1}:${ss.getMinutes()}:${ss.getSeconds()}`,
                        windspeed : `${final.wind.speed} `,
                        direction : `${final.wind.deg}\u00B0`,
                        error : false
                    }  
                }
            )).catch(err => {
                return {
                    error : true
                }
            });
        }
    }
}

export const zipcode = writable(false);
export const metric = writable(0);
export const weather = createWeather({
    data : false,
    msg : '',
    weather : '',
    temperature : {
        current : '',
        min : '',
        max : ''
    },
    humidity : '',
    sunrise : '',
    sunset : '',
    windspeed : '',
    direction : ''
});