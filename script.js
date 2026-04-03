function showDistrict(district) {
  const panel = document.getElementById("info-panel");

  const districtInfo = {
    A1: {
      name: "A1",
      area: "Downtown / central Boston areas",
      incidents: 72755,
      system: "A system might read this district as highly active or high risk because of dense reporting.",
      reality: "High activity does not automatically mean a place is inherently dangerous. Central districts often have more foot traffic, tourism, businesses, and reporting.",
      question: "What context gets lost when high volume is treated as high danger?"
    },
    A7: {
      name: "A7",
      area: "East Boston area",
      incidents: 27895,
      system: "An algorithm might reduce this district to a crime count without considering community history or reporting patterns.",
      reality: "Raw numbers alone do not explain neighborhood conditions, social context, or policing differences.",
      question: "How does data flatten a full community into one label?"
    },
    B2: {
      name: "B2",
      area: "Roxbury area",
      incidents: 99635,
      system: "A system may flag this district as high risk based on repeated incident totals.",
      reality: "This can reinforce existing stereotypes, especially when the system ignores over-policing, reporting density, and structural inequality.",
      question: "When does data analysis become stereotype reinforcement?"
    },
    B3: {
      name: "B3",
      area: "Mattapan area",
      incidents: 72162,
      system: "An algorithm may interpret repeated incidents as proof that the area is unsafe overall.",
      reality: "That conclusion can erase nuance and encourage broad assumptions about the people who live there.",
      question: "Who is harmed when place gets treated like identity?"
    },
    C6: {
      name: "C6",
      area: "South Boston area",
      incidents: 49522,
      system: "A model may rank this district using totals without distinguishing different offense types.",
      reality: "Grouping very different incidents together can create distorted perceptions.",
      question: "What happens when all incidents are treated the same?"
    },
    C11: {
      name: "C11",
      area: "Dorchester area",
      incidents: 86111,
      system: "A system might use incident frequency to label this district as more risky than others.",
      reality: "That label may ignore the size, diversity, and complexity of the area.",
      question: "Can one score ever represent a neighborhood fairly?"
    },
    D4: {
      name: "D4",
      area: "South End / Back Bay area",
      incidents: 84927,
      system: "A dense district may appear high in incidents simply because more people move through it daily.",
      reality: "Data without context can confuse concentration, visibility, and actual risk.",
      question: "Does more reporting always mean more danger?"
    },
    D14: {
      name: "D14",
      area: "Allston / Brighton area",
      incidents: 43346,
      system: "A system may associate student-heavy areas with certain patterns and treat them as risk signals.",
      reality: "This can misrepresent everyday activity and overgeneralize large mixed communities.",
      question: "How do assumptions grow from partial data?"
    },
    E5: {
      name: "E5",
      area: "West Roxbury / Roslindale area",
      incidents: 29050,
      system: "Lower totals might make this district look safer in a simplified ranking.",
      reality: "Even that can be misleading because safety is more complex than a lower number.",
      question: "What makes an area seem safe to a system versus to a person?"
    },
    E13: {
      name: "E13",
      area: "Jamaica Plain area",
      incidents: 36510,
      system: "A system could translate mixed incident data into a single general risk score.",
      reality: "One number can hide the diversity and lived reality of the neighborhood.",
      question: "What is lost when complexity becomes a score?"
    },
    E18: {
      name: "E18",
      area: "Hyde Park area",
      incidents: 36547,
      system: "An algorithm may compare this district against others and produce a simplified ranking.",
      reality: "Rankings often sound objective even when they depend on incomplete assumptions.",
      question: "Why do rankings feel more factual than they really are?"
    }
  };

  const info = districtInfo[district];

  panel.innerHTML = `
    <h3>District ${info.name}</h3>
    <p><strong>Associated area:</strong> ${info.area}</p>
    <p><strong>Total recorded incidents:</strong> ${info.incidents.toLocaleString()}</p>
    <p><strong>What a system might assume:</strong> ${info.system}</p>
    <p><strong>Why that can be misleading:</strong> ${info.reality}</p>
    <p><strong>Question to consider:</strong> ${info.question}</p>
  `;
}