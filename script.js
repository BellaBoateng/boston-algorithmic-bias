const districtInfo = {
  A1: {
    name: "A1",
    area: "Downtown / central Boston areas",
    system: "A system might read this district as highly active or high risk because of dense reporting.",
    reality: "High activity does not automatically mean a place is inherently dangerous. Central districts often have more foot traffic, tourism, businesses, and reporting.",
    question: "What context gets lost when high volume is treated as high danger?"
  },
  A7: {
    name: "A7",
    area: "East Boston area",
    system: "An algorithm might reduce this district to a crime count without considering community history or reporting patterns.",
    reality: "Raw numbers alone do not explain neighborhood conditions, social context, or policing differences.",
    question: "How does data flatten a full community into one label?"
  },
  B2: {
    name: "B2",
    area: "Roxbury area",
    system: "A system may flag this district as high risk based on repeated incident totals.",
    reality: "This can reinforce existing stereotypes, especially when the system ignores over-policing, reporting density, and structural inequality.",
    question: "When does data analysis become stereotype reinforcement?"
  },
  B3: {
    name: "B3",
    area: "Mattapan area",
    system: "An algorithm may interpret repeated incidents as proof that the area is unsafe overall.",
    reality: "That conclusion can erase nuance and encourage broad assumptions about the people who live there.",
    question: "Who is harmed when place gets treated like identity?"
  },
  C6: {
    name: "C6",
    area: "South Boston area",
    system: "A model may rank this district using totals without distinguishing different offense types.",
    reality: "Grouping very different incidents together can create distorted perceptions.",
    question: "What happens when all incidents are treated the same?"
  },
  C11: {
    name: "C11",
    area: "Dorchester area",
    system: "A system might use incident frequency to label this district as more risky than others.",
    reality: "That label may ignore the size, diversity, and complexity of the area.",
    question: "Can one score ever represent a neighborhood fairly?"
  },
  D4: {
    name: "D4",
    area: "South End / Back Bay area",
    system: "A dense district may appear high in incidents simply because more people move through it daily.",
    reality: "Data without context can confuse concentration, visibility, and actual risk.",
    question: "Does more reporting always mean more danger?"
  },
  D14: {
    name: "D14",
    area: "Allston / Brighton area",
    system: "A system may associate student-heavy areas with certain patterns and treat them as risk signals.",
    reality: "This can misrepresent everyday activity and overgeneralize large mixed communities.",
    question: "How do assumptions grow from partial data?"
  },
  E5: {
    name: "E5",
    area: "West Roxbury / Roslindale area",
    system: "Lower totals might make this district look safer in a simplified ranking.",
    reality: "Even that can be misleading because safety is more complex than a lower number.",
    question: "What makes an area seem safe to a system versus to a person?"
  },
  E13: {
    name: "E13",
    area: "Jamaica Plain area",
    system: "A system could translate mixed incident data into a single general risk score.",
    reality: "One number can hide the diversity and lived reality of the neighborhood.",
    question: "What is lost when complexity becomes a score?"
  },
  E18: {
    name: "E18",
    area: "Hyde Park area",
    system: "An algorithm may compare this district against others and produce a simplified ranking.",
    reality: "Rankings often sound objective even when they depend on incomplete assumptions.",
    question: "Why do rankings feel more factual than they really are?"
  }
};

let districtCounts = new Map();

function formatNumber(num) {
  return Number(num).toLocaleString();
}

function renderInfoPanel(districtCode) {
  const panel = document.getElementById("info-panel");
  const info = districtInfo[districtCode];

  if (!info) {
    panel.innerHTML = `
      <h3>District ${districtCode}</h3>
      <p><strong>Total recorded incidents:</strong> ${districtCounts.has(districtCode) ? formatNumber(districtCounts.get(districtCode)) : "Not available"
      }</p>
      <p>No interpretation text has been added for this district yet.</p>
    `;
    return;
  }

  const incidents = districtCounts.has(districtCode)
    ? formatNumber(districtCounts.get(districtCode))
    : "Not available";

  panel.innerHTML = `
    <h3>District ${info.name}</h3>
    <p><strong>Associated area:</strong> ${info.area}</p>
    <p><strong>Total recorded incidents:</strong> ${incidents}</p>
    <p><strong>What a system might assume:</strong> ${info.system}</p>
    <p><strong>Why that can be misleading:</strong> ${info.reality}</p>
    <p><strong>Question to consider:</strong> ${info.question}</p>
  `;
}

function setActiveDistrict(districtCode, source = "button") {
  document.querySelectorAll(".district-btn").forEach((btn) => {
    const isMatch = btn.textContent.trim() === districtCode;
    btn.classList.toggle("active-btn", isMatch);

    if (source === "map" && isMatch) {
      btn.blur();
    }
  });

  d3.selectAll(".district-shape")
    .classed("active", false)
    .style("opacity", 0.55);

  d3.select(`#shape-${districtCode.replace(/[^A-Za-z0-9]/g, "")}`)
    .classed("active", true)
    .style("opacity", 1);

  renderInfoPanel(districtCode);
}

function showDistrict(districtCode) {
  setActiveDistrict(districtCode, "button");
}

function getDistrictCode(properties) {
  const possibleKeys = [
    "DISTRICT",
    "District",
    "district",
    "NAME",
    "Name",
    "name",
    "BPD_DISTRICT",
    "POLICE_DIST",
    "DIST"
  ];

  for (const key of possibleKeys) {
    if (properties[key]) {
      const value = String(properties[key]).trim().toUpperCase();
      const match = value.match(/[A-Z]\\d{1,2}/);
      if (match) return match[0];
      return value;
    }
  }

  for (const value of Object.values(properties)) {
    if (value) {
      const match = String(value).trim().toUpperCase().match(/[A-Z]\\d{1,2}/);
      if (match) return match[0];
    }
  }

  return null;
}

function showFactor(type) {
  const box = document.getElementById("factor-info");

  if (type === "policing") {
    box.innerHTML =
      "Areas with heavier police presence often generate more recorded incidents. This can make districts appear more dangerous even when behavior levels are similar.";
  }

  if (type === "population") {
    box.innerHTML =
      "Dense districts with tourism, transit, and nightlife naturally produce more interactions and more reports, which may inflate perceived risk.";
  }

  if (type === "reporting") {
    box.innerHTML =
      "Communities differ in how often incidents are reported. Algorithms rarely account for differences in reporting behavior.";
  }
}

async function loadMap() {
  const csvData = await d3.csv("data/district_counts.csv", d3.autoType);
  const geoData = await d3.json("data/police_districts.geojson");

  districtCounts = new Map(
    csvData
      .filter((d) => d.DISTRICT && d.DISTRICT !== "External")
      .map((d) => [String(d.DISTRICT).trim().toUpperCase(), d.incident_count])
  );

  const width = 760;
  const height = 460;

  const svg = d3
    .select("#map")
    .html("")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  const projection = d3.geoIdentity().reflectY(true).fitSize([width, height], geoData);
  const path = d3.geoPath(projection);

  const values = Array.from(districtCounts.values());

  const minValue = d3.min(values);
  const maxValue = d3.max(values);

  const color = d3
    .scaleLinear()
    .domain([minValue, maxValue])
    .range(["#93c5fd", "#1e3a8a"]);

  const tooltip = d3.select("#map-tooltip");

  const features = geoData.features
    .map((feature) => {
      const districtCode = getDistrictCode(feature.properties || {});
      feature.districtCode = districtCode;
      return feature;
    })
    .filter((feature) => feature.districtCode && districtCounts.has(feature.districtCode));

  svg
    .selectAll("path")
    .data(features)
    .enter()
    .append("path")
    .attr("class", "district-shape")
    .attr("id", (d) => `shape-${d.districtCode.replace(/[^A-Za-z0-9]/g, "")}`)
    .attr("d", path)
    .attr("fill", (d) => color(districtCounts.get(d.districtCode)))
    .on("mouseenter", function (event, d) {
      const count = districtCounts.get(d.districtCode);

      tooltip
        .style("opacity", 1)
        .html(`
          <strong>District ${d.districtCode}</strong><br>
          Incidents: ${formatNumber(count)}
        `);
    })
    .on("mousemove", function (event) {
      tooltip
        .style("left", `${event.offsetX + 16}px`)
        .style("top", `${event.offsetY + 16}px`);
    })
    .on("mouseleave", function () {
      tooltip.style("opacity", 0);
    })
    .on("click", (_, d) => setActiveDistrict(d.districtCode, "map"));

  svg
    .selectAll("text")
    .data(features)
    .enter()
    .append("text")
    .attr("class", "map-label")
    .attr("transform", (d) => {
      const [x, y] = path.centroid(d);
      return `translate(${x}, ${y})`;
    })
    .text((d) => d.districtCode);

  setActiveDistrict("B2");
}

loadMap().catch((error) => {
  console.error("Map failed to load:", error);
  const mapDiv = document.getElementById("map");
  if (mapDiv) {
    mapDiv.innerHTML = `
      <div style="padding: 24px;">
        <strong>Map failed to load.</strong>
        <p>${error.message}</p>
      </div>
    `;
  }
});

let selectedLeftCard = null;
let selectedRightCard = null;
let correctMatches = 0;

const leftCards = document.querySelectorAll(".left-card");
const rightCards = document.querySelectorAll(".right-card");
const matchStatus = document.getElementById("match-status");
const matchReflection = document.getElementById("match-reflection");

leftCards.forEach((card) => {
  card.addEventListener("click", () => {
    if (card.classList.contains("correct")) return;

    leftCards.forEach((c) => {
      if (!c.classList.contains("correct")) c.classList.remove("selected");
    });

    selectedLeftCard = card;
    card.classList.add("selected");
    checkMatchAttempt();
  });
});

rightCards.forEach((card) => {
  card.addEventListener("click", () => {
    if (card.classList.contains("correct")) return;

    rightCards.forEach((c) => {
      if (!c.classList.contains("correct")) c.classList.remove("selected");
    });

    selectedRightCard = card;
    card.classList.add("selected");
    checkMatchAttempt();
  });
});

function checkMatchAttempt() {
  if (!selectedLeftCard || !selectedRightCard) return;

  const leftMatch = selectedLeftCard.dataset.match;
  const rightMatch = selectedRightCard.dataset.match;

  if (leftMatch === rightMatch) {
    selectedLeftCard.classList.remove("selected");
    selectedRightCard.classList.remove("selected");

    selectedLeftCard.classList.add("correct", "matched");
    selectedRightCard.classList.add("correct", "matched");

    matchStatus.textContent = "Matched. Context changes how data should be interpreted.";
    correctMatches++;

    selectedLeftCard = null;
    selectedRightCard = null;

    if (correctMatches === 4) {
      matchStatus.textContent = "All matches completed. Reflection unlocked below.";
      matchReflection.classList.remove("hidden");
    }
  } else {
    selectedLeftCard.classList.add("wrong");
    selectedRightCard.classList.add("wrong");

    matchStatus.textContent = "Not quite. Try again and think about what the data might not show.";

    setTimeout(() => {
      selectedLeftCard.classList.remove("selected", "wrong");
      selectedRightCard.classList.remove("selected", "wrong");
      selectedLeftCard = null;
      selectedRightCard = null;
    }, 700);
  }
}