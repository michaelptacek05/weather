import './style.css';

const apiKey = process.env.API_KEY;

const loader = document.querySelector(".loader") as HTMLDivElement;
const container = document.querySelector(".container") as HTMLDivElement;
const input = document.querySelector(".cityInput") as HTMLInputElement;
const search = document.querySelector(".searchButton") as HTMLButtonElement;
const displayAddress = document.querySelector(
    ".display-address"
) as HTMLHeadingElement;
const displayTemp = document.querySelector(
    ".display-temp"
) as HTMLParagraphElement;
const displayDesc = document.querySelector(
    ".display-desc"
) as HTMLParagraphElement;

interface WeatherInfo {
    address: string;
    temp: number;
    conditions: string;
    description: string;
    humidity: number;
}

function processWeatherData(data: any): WeatherInfo {
    const processedData: WeatherInfo = {
        address: data.resolvedAddress,
        temp: data.currentConditions.temp,
        conditions: data.currentConditions.conditions,
        description: data.description,
        humidity: data.currentConditions.humidity,
    };

    return processedData;
}

function displayData(data: WeatherInfo): void {
    displayAddress.textContent = data.address;
    displayTemp.textContent = `Teplota: ${data.temp} °C`;
    displayDesc.textContent = `${data.description} (Vlhkost: ${data.humidity}%)`;
}

async function getWeather(city: string) {
    try {
        loader.style.display = "block";
        const response = await fetch(
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${apiKey}&unitGroup=metric`
        );
        const data = await response.json();
        const processData = processWeatherData(data);
        displayData(processData);

    } catch (error) {
        console.error(`Chyba stahování dat: ${error}`);
        alert("Nepodařilo se načíst počasí. :( Zkontrolujte název města.");
    } finally {
        loader.style.display = "none";
        container.style.display = "block"
    }
}

search.addEventListener("click", () => {
    const city = input.value;
    if (city !== "") {
        getWeather(city);
    }
});
