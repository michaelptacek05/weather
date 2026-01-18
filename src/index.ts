import "./style.css"

const apiKey = process.env.API_KEY;

const loader = document.querySelector(".loader") as HTMLDivElement;
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
const forecastContainer = document.querySelector(".forecast") as HTMLDivElement;
const container = document.querySelector(".container") as HTMLDivElement;

interface Forecast {
    date: string;
    tempMax: number;
    tempMin: number;
    conditions: string;
}

interface WeatherInfo {
    address: string;
    temp: number;
    conditions: string;
    description: string;
    humidity: number;
    forecast: Forecast[];
}

function processWeatherData(data: any): WeatherInfo {
    const forecastDays: Forecast[] = data.days.slice(1, 6).map((day: any) => {
        return {
            date: day.datetime,
            tempMax: day.tempmax,
            tempMin: day.tempmin,
            conditions: day.conditions,
        };
    });
    const processedData: WeatherInfo = {
        address: data.resolvedAddress,
        temp: data.currentConditions.temp,
        conditions: data.currentConditions.conditions,
        description: data.description,
        humidity: data.currentConditions.humidity,
        forecast: forecastDays,
    };

    return processedData;
}

function displayData(data: WeatherInfo): void {
    displayAddress.textContent = data.address;
    displayTemp.textContent = `Teplota: ${data.temp} °C`;
    displayDesc.textContent = `${data.description} (Vlhkost: ${data.humidity}%)`;

    if (forecastContainer) {
        forecastContainer.innerHTML = "";

        data.forecast.forEach((day) => {
            const dayElement = document.createElement("div");
            dayElement.classList.add("forecast-box");
            const dateObj = new Date(day.date);
            const dateStr = dateObj.toLocaleDateString("cs-CZ", {
                weekday: "short",
                day: "numeric",
                month: "numeric",
            });

            dayElement.innerHTML = `
                <h3>${dateStr}</h3>
                <p>${day.conditions}</p>
                <p><strong>${day.tempMax}°C</strong> / ${day.tempMin}°C</p>
            `;

            forecastContainer.appendChild(dayElement);
        });
    }
}

async function getWeather(city: string) {
    try {
        loader.style.display = "block";
        const response = await fetch(
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${apiKey}&unitGroup=metric`
        );
        const data = await response.json();
        console.log(data);
        const processData = processWeatherData(data);
        displayData(processData);
    } catch (error) {
        console.error(`Chyba stahování dat: ${error}`);
        alert("Nepodařilo se načíst počasí. :( Zkontrolujte název města.");
    } finally {
        loader.style.display = "none";
        container.style.display = "block";
    }
}

search.addEventListener("click", () => {
    const city = input.value;
    if (city !== "") {
        getWeather(city);
    }
});
