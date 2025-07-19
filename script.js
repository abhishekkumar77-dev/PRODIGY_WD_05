const apiKey = "4d3a4f7d98da456b945145858251606"; 

  function getWeather() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=4`;

          fetch(url)
            .then(res => res.json())
            .then(data => {
              const d = new Date();
              const day = d.toLocaleString("en-us", { weekday: "long" });
              const date = d.toLocaleString("en-us", { month: "short", day: "numeric", year: "numeric" });

              document.getElementById("day").textContent = day;
              document.getElementById("location").textContent = `${date} | ${data.location.name}`;
              document.getElementById("temp").textContent = data.current.temp_c + "°C";
              document.getElementById("desc").textContent = data.current.condition.text;

              if (document.getElementById("humidity"))
                document.getElementById("humidity").textContent = data.current.humidity + "%";
              if (document.getElementById("wind"))
                document.getElementById("wind").textContent = data.current.wind_kph + " km/h";
              if (document.getElementById("precip"))
                document.getElementById("precip").textContent = data.current.precip_mm + " mm";

              // Show forecast
              const forecastContainer = document.getElementById("forecast");
              forecastContainer.innerHTML = ""; // clear existing

              data.forecast.forecastday.forEach((dayData, index) => {
                const forecastDate = new Date(dayData.date);
                const dayName = forecastDate.toLocaleDateString("en-us", { weekday: "short" });
                const avgTemp = dayData.day.avgtemp_c;
                const condition = dayData.day.condition.text;
                const icon = dayData.day.condition.icon;

                const div = document.createElement("div");
                div.className = "forecast-day" + (index === 0 ? " active" : "");
                div.setAttribute("onclick", "highlightDay(this)");
                div.innerHTML = `
                  <p>${dayName}</p>
                  <img src="https:${icon}" alt="${condition}" width="40" />
                  <p>${avgTemp}°C</p>
                `;
                forecastContainer.appendChild(div);
              });
            })
            .catch((err) => {
              console.error("Fetch error:", err);
              alert("Weather info not found.");
            });
        },
        (err) => {
          console.error("Geolocation error:", err);
          alert("Location access denied or not available.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  function highlightDay(elem) {
    document.querySelectorAll('.forecast-day').forEach(e => e.classList.remove('active'));
    elem.classList.add('active');
  }

  function toggleMode() {
    document.body.classList.toggle("light-mode");
  }

  function updateTime() {
    const now = new Date();
    const time = now.toLocaleTimeString();
    const day = now.toLocaleString("en-us", { weekday: "long" });
    const date = now.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" });
    document.getElementById("time").textContent = `${time} | ${day}, ${date}`;
  }

  setInterval(updateTime, 1000);
  updateTime();
  window.onload = getWeather; // auto-call when page loads
