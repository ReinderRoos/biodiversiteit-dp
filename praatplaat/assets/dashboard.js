/**
 * Gespreksdashboard — platen A–D
 * A/B/C: lichte lens + verwijzing naar D (geen tekstduplicatie).
 * D: diagnose — patroonzin + vignettes + casus (bron van waarheid).
 */
(function () {
  const body = document.body;
  const tabBtns = Array.from(document.querySelectorAll(".dp-tabs__btn[data-plate]"));
  const panels = Array.from(document.querySelectorAll("[data-plate-panel]"));
  const filterBtns = Array.from(document.querySelectorAll(".dp-filter[data-filter]"));
  const cards = Array.from(document.querySelectorAll(".dp-card[data-domain]"));
  const cardCount = document.getElementById("card-count");

  const plateD = document.querySelector('[data-plate-panel="d"]');
  const pathSteps = plateD
    ? Array.from(plateD.querySelectorAll(".dp-path__step[data-step]"))
    : [];
  const pathFeedback = document.getElementById("path-feedback");
  const pathReset = document.getElementById("path-reset");
  const forkBtns = plateD
    ? Array.from(plateD.querySelectorAll(".dp-fork-toggle[data-fork]"))
    : [];

  const mapToggles = Array.from(document.querySelectorAll(".dp-map-toggle"));
  const mapFeedback = document.getElementById("map-feedback");

  const contrastToggles = Array.from(
    document.querySelectorAll(".dp-contrast-toggle[data-contrast]")
  );
  const contrastFeedback = document.getElementById("contrast-feedback");
  const contrastChain = document.getElementById("contrast-chain");

  const scarceToggles = Array.from(
    document.querySelectorAll(".dp-scarce-toggle[data-scarce]")
  );
  const scarceForks = Array.from(
    document.querySelectorAll(".dp-scarce-fork[data-fork]")
  );
  const scarceFeedback = document.getElementById("scarce-feedback");

  /** Bron van waarheid — volledige gespreksstof (plaat D). */
  const STEP_CONTENT = {
    "1": {
      title: "Prestatieopgave",
      vignette:
        "Biodiversiteit zit al in wat het asset moet leveren — niet pas in de maatregel. Denk aan een ecoduct of faunapassage: natuurverbinding én impact op onderhoud en VNB (voorziene niet-beschikbaarheid) van het wegverkeer.",
      questions: [
        "Staat “natuurverbinding / leefgebied” expliciet in de prestatieopgave, of alleen “veilige, beschikbare infrastructuur”?",
        "Wat doet zo’n maatregel met extra onderhoudsinspanning en met VNB — en wie weegt dat af?"
      ],
      casus: "Weg/infra (ecoduct); vergelijk spoor: eco-berm vs zicht/vlucht/brand.",
      domains: ["spoor", "kader"]
    },
    "2": {
      title: "Biodiversiteit als prestatie",
      vignette:
        "Natuur zit in hetzelfde stuurveld als veiligheid en beschikbaarheid — geen aparte bijlage. Als eco bijdraagt aan de assetfunctie, hoort het in SAMP / bedrijfswaardenmatrix.",
      questions: [
        "Kunnen jullie biodiversiteit in één zin als prestatie formuleren (niet als intentie)?",
        "Zit die zin al in SAMP/BWM, of alleen in een duurzaamheidsparagraaf?"
      ],
      casus: "BWM/HWBP-kaart; STOWA-kader (KPI’s bestaan — zitten ze in het besluitmoment?).",
      domains: ["kader"]
    },
    "3": {
      title: "Waardematrix",
      vignette:
        "Biodiversiteit concurreert zichtbaar met veiligheid, kosten en beschikbaarheid. Bij schaarste telt de rangorde: onomkeerbare natuurschade hoog; overige natuur vaak lager — formeel (verdringingsreeks) of impliciet (“veiligheid eerst”).",
      questions: [
        "Welke prestatie “wint” bij jullie als het schaars wordt — en waar staat biodiversiteit dan?",
        "Is die rangorde formeel vastgelegd, of vooral gewoonte aan tafel?"
      ],
      casus: "Droogte (zout/west · scheepvaart · polder); verdringingsreeks; rivierkreeft als waterkwaliteitsopgave; spoorveiligheid eerst.",
      domains: ["water", "spoor"]
    },
    "4": {
      title: "Prioriteren",
      vignette:
        "Hier worden maatregelen gerangschikt; biodiversiteit wint of verliest. Beslisboom dijken: sterkte · eco-potentie · budget. Oevers-ladder: natuurlijker → hergebruik → MKI → pas dan staal/beton. Insecten-optimaal is niet altijd uitvoerbaar.",
      questions: [
        "Bij de laatste prioritering: waar viel een biodiversiteitsmaatregel af — op sterkte, budget, of “niet in scope”?",
        "Helpt een ladder of beslisboom, of blijft het ad hoc?"
      ],
      casus: "Bloemrijke dijken; biobased oevers; inkoop/certificaat in bestek.",
      domains: ["dijken", "oevers"]
    },
    "5": {
      title: "Besluit",
      vignette:
        "Biodiversiteit komt binnen als de voorkeur al (bijna) vastligt — sturen wordt toetsen. Klassiek: late eco-check na constructiekeuze, of ambitie in de aanbesteding zonder eis in het bestek.",
      questions: [
        "Is “biodiversiteit meegenomen” bij jullie vaak een check achteraf?",
        "Wat zou er veranderen als de vraag één stap eerder kwam — in de matrix, of bij meekoppelen met gepland werk?"
      ],
      casus: "Contrast “bijlage vszelfde tafel”; inkoop: bestek vs intentie.",
      domains: ["oevers", "kader"]
    }
  };

  const FORK_CONTENT = {
    meekoppel: {
      title: "Meekoppelkans",
      vignette:
        "Biodiversiteit meenemen bij werk dat toch al moet — dijkversterking, oeververnieuwing, groot onderhoud weg of spoor. De kans op uitvoering is groter dan bij een apart natuurtraject.",
      questions: [
        "Welke geplande maatregel dit jaar of volgend jaar biedt een “gratis” instap voor biodiversiteit?",
        "Stond biodiversiteit in die beslisboom, of was het geluk achteraf?"
      ],
      casus: "Dijkversterking + bloemrijk; oeververvanging + natuurlijke oever; onderhoudsvenster + eco-berm waar veiligheid het toelaat."
    },
    checklist: {
      title: "Biodiversiteit-checklist",
      vignette:
        "Bij elke technische maatregelkeuze kort toetsen: effect op biodiversiteit — naast veiligheid, kosten, MKI. Geen apart project; wel een vast besluitmoment.",
      questions: [
        "Staat “effect op biodiversiteit” op jullie keuzelijst bij materiaal, profiel of bermbeheer?",
        "Wie mag “nee, tenzij” zeggen als de checklist rood kleurt?"
      ],
      casus: "Oevers-ladder (natuurlijker eerst); spoor: eco-berm alleen waar zicht/vlucht/brand het toelaten."
    }
  };

  /** Unieke framing voor B — verwijst naar D-stappen, geen vignette-herhaling. */
  const CONTRAST_CONTENT = {
    bijlage: {
      title: "Bijlage / late toets",
      line: "Framing: biodiversiteit komt ná de primaire keuze. Op Jullie pad hoort dit bij stap 5 (en vaak een late pattern).",
      ask: "Waar merken jullie dit het meest — na constructiekeuze, of in de aanbesteding zonder eis in het bestek?",
      steps: ["5"],
      forks: [],
      chainSteps: ["5"],
      domains: ["kader", "oevers"]
    },
    matrix: {
      title: "Zelfde tafel",
      line: "Framing: biodiversiteit in hetzelfde stuurveld. Op Jullie pad: stappen 2–3 (prestatie + waardematrix).",
      ask: "Staat biodiversiteit al in jullie BWM/SAMP, of alleen in een duurzaamheidsparagraaf?",
      steps: ["2", "3"],
      forks: [],
      chainSteps: ["2", "3"],
      domains: ["kader"]
    }
  };

  /** Unieke druk-lens voor C — verwijst naar D, herhaalt geen matrix-vignette. */
  const SCARCE_CONTENT = {
    cat1: {
      title: "Cat. 1 — onomkeerbare natuurschade",
      line: "Formeel hoog in de rangorde. Check op Jullie pad (stap 3) of die rangorde bij jullie ook wint van beschikbaarheid.",
      ask: "Wint cat. 1 bij jullie in de praktijk, of alleen op papier?",
      steps: ["3"],
      forks: [],
      domains: ["water"]
    },
    cat4: {
      title: "Cat. 4 — overige natuur",
      line: "Lager in de rangorde: sneuvelt eerst bij schaarste. Op Jullie pad (stap 3–4) waar “overige” biodiversiteit afvalt.",
      ask: "Is die lagere plek bij jullie expliciet vastgelegd, of gewoonte?",
      steps: ["3", "4"],
      forks: [],
      domains: ["water"]
    },
    safety: {
      title: "Veiligheid eerst",
      line: "Harde rand: zicht / vlucht / brand. Op Jullie pad (stap 3–4) hoe eco binnen die rand wél mag.",
      ask: "Waar mag eco-berm of natuurlijke oever wél — en wie beslist dat?",
      steps: ["3", "4"],
      forks: [],
      domains: ["spoor"]
    }
  };

  function setPlate(id) {
    const plate = ["a", "b", "c", "d"].includes(id) ? id : "d";
    body.dataset.plate = plate;

    panels.forEach((p) => {
      p.hidden = p.dataset.platePanel !== plate;
    });

    tabBtns.forEach((btn) => {
      const on = btn.dataset.plate === plate;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });

    try {
      const url = new URL(window.location.href);
      url.searchParams.set("v", plate);
      history.replaceState(null, "", url);
    } catch (_) {
      /* ignore */
    }
  }

  function setFilter(domain) {
    const key = domain || "all";
    filterBtns.forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.filter === key);
    });

    let visible = 0;
    cards.forEach((card) => {
      const show = key === "all" || card.dataset.domain === key;
      card.hidden = !show;
      if (show) visible += 1;
    });

    if (cardCount) cardCount.textContent = String(visible);
  }

  function selectedSteps() {
    return pathSteps
      .filter((btn) => btn.getAttribute("aria-pressed") === "true")
      .map((btn) => btn.dataset.step)
      .sort((a, b) => Number(a) - Number(b));
  }

  function selectedForks() {
    return forkBtns
      .filter((btn) => btn.getAttribute("aria-pressed") === "true")
      .map((btn) => btn.dataset.fork);
  }

  function isContiguous(nums) {
    if (nums.length <= 1) return true;
    const n = nums.map(Number);
    for (let i = 1; i < n.length; i += 1) {
      if (n[i] !== n[i - 1] + 1) return false;
    }
    return true;
  }

  function matchPattern(nums) {
    if (nums.length === 0) return "P0";
    if (nums.length === 5) return "P-full";
    if (nums.length === 1) return "P" + nums[0];
    if (!isContiguous(nums)) return "P-gap";
    const min = Number(nums[0]);
    if (nums.indexOf("5") !== -1 && min >= 4) return "P-late";
    if (min <= 2 && nums.indexOf("5") === -1) return "P-early";
    if (min >= 3 && min <= 4) return "P-mid";
    if (isContiguous(nums)) return "P-contig";
    if (nums.length >= 3) return "P-wide";
    return "P-contig";
  }

  const PATTERNS = {
    P0: {
      line: "Markeer waar biodiversiteit nu binnenkomt — één of meer stappen, en/of een instapmoment hieronder.",
      move: "Start het gesprek: waar landt biodiversiteit bij jullie echt — vroeg genoeg om nog te sturen?"
    },
    P1: {
      line: "Jullie zetten biodiversiteit al in de prestatieopgave — zeldzaam en krachtig. De vervolgvraag: overleeft die lijn concurrentie in matrix en prioritering?",
      move: "Doorvragen op stappen 3–4: waar zou deze opgave alsnog sneuvelen?"
    },
    P2: {
      line: "Biodiversiteit is “prestatie” op papier. Check of die ook in de waardematrix en prioritering landt — anders blijft het een label.",
      move: "Vraag naar SAMP/BWM en één recent besluit waarin die prestatie wél/niet meewoog."
    },
    P3: {
      line: "Biodiversiteit zit in de afwegingstafel — goed. Komt die te laat als de prestatieopgave al dichtzit zonder natuur?",
      move: "Vergelijk met verdringingsreeks of droogte-voorrang: is jullie rangorde expliciet?"
    },
    P4: {
      line: "Biodiversiteit speelt bij het rangschikken van maatregelen. Risico: alleen opties die toevallig overblijven na veiligheid en budget.",
      move: "Pak dijk- of oevervoorbeeld: stond eco in de beslisboom of was het restpost?"
    },
    P5: {
      line: "Late instap: biodiversiteit bij het besluit is vaak toets, geen sturing.",
      move: "Stuur naar meekoppel of checklist — één stap eerder in het pad."
    },
    "P-early": {
      line: "Vroege instap — kans om te sturen. Vraag of die lijn tot het besluit doorloopt of onderweg afvalt.",
      move: "Zoek het gat: waar tussen opgave en besluit verdwijnt biodiversiteit?"
    },
    "P-mid": {
      line: "Midden van de keten: jullie wegen of prioriteren, maar de asset-opgave zelf is mogelijk al gezet zonder biodiversiteit.",
      move: "Mag natuur nog terug naar de prestatieopgave, of alleen concurreren binnen andermans opgave?"
    },
    "P-late": {
      line: "Laat in het pad — sturen wordt beperkt; toetsen blijft over.",
      move: "Wat is het vroegste moment waarop jullie wél hadden kunnen bijsturen?"
    },
    "P-gap": {
      line: "Gat in de keten: biodiversiteit komt binnen, valt weg, en duikt later weer op — typisch intentie → stilte → late toets.",
      move: "Welk gat is het pijnlijkst — tussen opgave en matrix, of tussen prioritering en besluit?"
    },
    "P-contig": {
      line: "Doorlopend stuk pad — sterke basis. De randen (vóór of na dit blok) zijn vaak het echte gesprek.",
      move: "Wat ontbreekt links of rechts van dit blok in jullie echte projecten?"
    },
    "P-full": {
      line: "Biodiversiteit zou overal meelopen — is dat werkelijkheid of wensbeeld?",
      move: "Vraag één concreet, anoniem project: waar won natuur echt, en waar alleen op papier?"
    },
    "P-wide": {
      line: "Breed gemarkeerd. Scherpstellen: waar wint biodiversiteit echt — en waar alleen op papier?",
      move: "Kies samen één stap als “waar het vastloopt” en blijf daar."
    }
  };

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderStepBlock(stepId) {
    const c = STEP_CONTENT[stepId];
    if (!c) return "";
    const qs = c.questions
      .map((q) => "<li>" + escapeHtml(q) + "</li>")
      .join("");
    return (
      '<article class="dp-path__block" data-for-step="' +
      escapeHtml(stepId) +
      '">' +
      '<header class="dp-path__block-head"><span class="dp-step__n">' +
      escapeHtml(stepId) +
      "</span><strong>" +
      escapeHtml(c.title) +
      "</strong></header>" +
      '<p class="dp-path__vignette">' +
      escapeHtml(c.vignette) +
      "</p>" +
      '<p class="dp-path__ask-label">Vragen aan tafel</p>' +
      '<ul class="dp-path__ask">' +
      qs +
      "</ul>" +
      '<p class="dp-path__casus"><span>Casus-anker</span> ' +
      escapeHtml(c.casus) +
      "</p>" +
      "</article>"
    );
  }

  function renderForkBlock(forkId) {
    const c = FORK_CONTENT[forkId];
    if (!c) return "";
    const qs = c.questions
      .map((q) => "<li>" + escapeHtml(q) + "</li>")
      .join("");
    return (
      '<article class="dp-path__block dp-path__block--fork" data-for-fork="' +
      escapeHtml(forkId) +
      '">' +
      '<header class="dp-path__block-head"><strong>' +
      escapeHtml(c.title) +
      "</strong></header>" +
      '<p class="dp-path__vignette">' +
      escapeHtml(c.vignette) +
      "</p>" +
      '<p class="dp-path__ask-label">Vragen aan tafel</p>' +
      '<ul class="dp-path__ask">' +
      qs +
      "</ul>" +
      '<p class="dp-path__casus"><span>Casus-anker</span> ' +
      escapeHtml(c.casus) +
      "</p>" +
      "</article>"
    );
  }

  function domainsForSelection(nums, forks) {
    const set = {};
    nums.forEach((id) => {
      const d = (STEP_CONTENT[id] && STEP_CONTENT[id].domains) || [];
      d.forEach((x) => {
        set[x] = true;
      });
    });
    if (forks.indexOf("meekoppel") !== -1) {
      set.dijken = true;
      set.oevers = true;
    }
    if (forks.indexOf("checklist") !== -1) {
      set.oevers = true;
      set.spoor = true;
    }
    return Object.keys(set);
  }

  function highlightCards(domainKeys) {
    cards.forEach((card) => {
      const match = domainKeys.indexOf(card.dataset.domain) !== -1;
      card.classList.toggle("is-suggested", match && domainKeys.length > 0);
    });
  }

  function updatePathFeedback() {
    if (!pathFeedback) return;
    const nums = selectedSteps();
    const forks = selectedForks();
    const patternId = matchPattern(nums);
    const pattern = PATTERNS[patternId] || PATTERNS.P0;

    if (nums.length === 0 && forks.length === 0) {
      pathFeedback.innerHTML =
        '<div class="dp-path__pattern">' +
        '<p class="dp-path__pattern-line">' +
        escapeHtml(pattern.line) +
        "</p>" +
        '<p class="dp-path__move"><span>Gesprekszet</span> ' +
        escapeHtml(pattern.move) +
        "</p>" +
        "</div>";
      highlightCards([]);
      return;
    }

    let html =
      '<div class="dp-path__pattern">' +
      '<p class="dp-path__pattern-line">' +
      escapeHtml(pattern.line) +
      "</p>" +
      '<p class="dp-path__move"><span>Gesprekszet</span> ' +
      escapeHtml(pattern.move) +
      "</p>" +
      "</div>";

    if (nums.length === 0 && forks.length > 0) {
      html =
        '<div class="dp-path__pattern">' +
        '<p class="dp-path__pattern-line">Je hebt een instapmoment gekozen zonder nog een stap in de keten te markeren — prima starthypothese. Koppel dit aan waar biodiversiteit in het pad landt.</p>' +
        '<p class="dp-path__move"><span>Gesprekszet</span> Markeer daarna de stap(pen) waar dit instapmoment bij jullie echt speelt.</p>' +
        "</div>";
    }

    const key = nums.join("+");
    const bridges = {
      "1+5":
        "Prestatieopgave noemt natuur, besluit toetst natuur — daartussen geen stuurmoment. Klassiek: ecoduct in de visie, VNB en kosten pas laat in beeld.",
      "2+5":
        "Prestatie-label vroeg, toets laat: risico dat de “prestatie” nooit in matrix of prioritering landt.",
      "1+4":
        "Opgave en prioritering zonder zichtbare matrix: hoe wegen jullie dan veiligheid, kosten en biodiversiteit tegen elkaar?",
      "2+3":
        "Prestatie + matrix: jullie hebben besluittaal. Ontbreekt prioritering (stap 4) nog in de praktijk?",
      "3+4":
        "Afwegen en prioriteren zonder biodiversiteit in de opgave — dan concurreert natuur met een al dichtgetimmerde primaire prestatie.",
      "4+5":
        "Prioritering mondt uit in besluit: check of biodiversiteit daar nog iets wijzigt, of alleen wordt genoteerd.",
      "2+3+4":
        "Sterke middenketen. Ontbreekt stap 1 (opgave) nog, dan presteert biodiversiteit binnen andermans assetdoel.",
      "1+2+3+4":
        "Bijna de volle keten tot vóór het besluit — vraag waar het besluit biodiversiteit nog kan overrulen (veiligheid, VNB, budget)."
    };
    if (bridges[key]) {
      html +=
        '<p class="dp-path__bridge">' + escapeHtml(bridges[key]) + "</p>";
    }

    if (forks.length === 2) {
      html +=
        '<p class="dp-path__bridge">Beide instappen gemarkeerd — geen rangorde welke beter is. Vraag: wat helpt jullie adviseur biodiversiteit méér in de praktijk: meekoppelen, of de checklist bij technische keuzes?</p>';
    }

    nums.forEach((id) => {
      html += renderStepBlock(id);
    });
    forks.forEach((id) => {
      html += renderForkBlock(id);
    });

    pathFeedback.innerHTML = html;
    highlightCards(domainsForSelection(nums, forks));
  }

  function resetPath() {
    pathSteps.forEach((btn) => btn.setAttribute("aria-pressed", "false"));
    forkBtns.forEach((btn) => btn.setAttribute("aria-pressed", "false"));
    updatePathFeedback();
  }

  /** Merge stappen/vorken op D en open plaat D. */
  function primePath(steps, forks) {
    (steps || []).forEach((id) => {
      const btn = pathSteps.find((b) => b.dataset.step === id);
      if (btn) btn.setAttribute("aria-pressed", "true");
    });
    (forks || []).forEach((id) => {
      const btn = forkBtns.find((b) => b.dataset.fork === id);
      if (btn) btn.setAttribute("aria-pressed", "true");
    });
    updatePathFeedback();
    setPlate("d");
    if (pathFeedback) {
      try {
        pathFeedback.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } catch (_) {
        /* ignore */
      }
    }
  }

  function renderGotoBtn(steps, forks, label) {
    const s = (steps || []).join(",");
    const f = (forks || []).join(",");
    return (
      '<button type="button" class="dp-goto-path" data-goto-steps="' +
      escapeHtml(s) +
      '" data-goto-forks="' +
      escapeHtml(f) +
      '">' +
      escapeHtml(label || "Open op Jullie pad →") +
      "</button>"
    );
  }

  function bindGotoButtons(container) {
    if (!container) return;
    container.querySelectorAll(".dp-goto-path").forEach((btn) => {
      btn.addEventListener("click", () => {
        const steps = (btn.dataset.gotoSteps || "")
          .split(",")
          .filter(Boolean);
        const forks = (btn.dataset.gotoForks || "")
          .split(",")
          .filter(Boolean);
        primePath(steps, forks);
      });
    });
  }

  function renderLensCard(opts) {
    const title = opts.title || "";
    const line = opts.line || "";
    const ask = opts.ask || "";
    const steps = opts.steps || [];
    const forks = opts.forks || [];
    const domains = opts.domains || [];
    const gotoLabel = opts.gotoLabel || "Open op Jullie pad →";

    highlightCards(domains);

    return (
      '<div class="dp-lens">' +
      (title
        ? '<header class="dp-lens__head"><strong>' +
          escapeHtml(title) +
          "</strong></header>"
        : "") +
      '<p class="dp-lens__line">' +
      escapeHtml(line) +
      "</p>" +
      (ask
        ? '<p class="dp-lens__ask"><span>Vraag aan tafel</span> ' +
          escapeHtml(ask) +
          "</p>"
        : "") +
      renderGotoBtn(steps, forks, gotoLabel) +
      "</div>"
    );
  }

  /* ——— Plaat A: single-select map ——— */
  function clearMapPressed() {
    mapToggles.forEach((btn) => btn.setAttribute("aria-pressed", "false"));
  }

  function updateMapFeedback(kind, id) {
    if (!mapFeedback) return;
    if (!kind || !id) {
      mapFeedback.innerHTML = "";
      highlightCards([]);
      return;
    }

    if (kind === "step") {
      const c = STEP_CONTENT[id];
      if (!c) return;
      mapFeedback.innerHTML = renderLensCard({
        title: c.title,
        line:
          "Stap " +
          id +
          " in de besluitlijn. Casus, vervolgvragen en patroonzin staan op Jullie pad.",
        ask: c.questions[0],
        steps: [id],
        forks: [],
        domains: c.domains || [],
        gotoLabel: "Markeer stap " + id + " op Jullie pad →"
      });
    } else if (kind === "fork") {
      const c = FORK_CONTENT[id];
      if (!c) return;
      mapFeedback.innerHTML = renderLensCard({
        title: c.title,
        line: "Instapmoment. Volledige vignette en casus op Jullie pad.",
        ask: c.questions[0],
        steps: [],
        forks: [id],
        domains: domainsForSelection([], [id]),
        gotoLabel: "Markeer “" + c.title + "” op Jullie pad →"
      });
    }
    bindGotoButtons(mapFeedback);
  }

  mapToggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const wasOn = btn.getAttribute("aria-pressed") === "true";
      clearMapPressed();
      if (wasOn) {
        updateMapFeedback(null, null);
        return;
      }
      btn.setAttribute("aria-pressed", "true");
      const kind = btn.dataset.map;
      const id = kind === "fork" ? btn.dataset.fork : btn.dataset.step;
      updateMapFeedback(kind, id);
    });
  });

  /* ——— Plaat B: contrast ——— */
  function setChainHighlight(stepIds) {
    if (!contrastChain) return;
    const set = {};
    (stepIds || []).forEach((id) => {
      set[id] = true;
    });
    contrastChain.querySelectorAll("[data-chain-step]").forEach((el) => {
      el.classList.toggle("is-related", !!set[el.dataset.chainStep]);
    });
    const forkEl = contrastChain.querySelector("[data-chain-fork]");
    if (forkEl) forkEl.classList.remove("is-related");
  }

  function clearContrastPressed() {
    contrastToggles.forEach((btn) =>
      btn.setAttribute("aria-pressed", "false")
    );
  }

  function updateContrastFeedback(id) {
    if (!contrastFeedback) return;
    if (!id) {
      contrastFeedback.innerHTML = "";
      setChainHighlight([]);
      highlightCards([]);
      return;
    }
    const c = CONTRAST_CONTENT[id];
    if (!c) return;
    setChainHighlight(c.chainSteps || c.steps);
    contrastFeedback.innerHTML = renderLensCard({
      title: c.title,
      line: c.line,
      ask: c.ask,
      steps: c.steps,
      forks: c.forks,
      domains: c.domains,
      gotoLabel: "Markeer op Jullie pad →"
    });
    bindGotoButtons(contrastFeedback);
  }

  contrastToggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const wasOn = btn.getAttribute("aria-pressed") === "true";
      clearContrastPressed();
      if (wasOn) {
        updateContrastFeedback(null);
        return;
      }
      btn.setAttribute("aria-pressed", "true");
      updateContrastFeedback(btn.dataset.contrast);
    });
  });

  /* ——— Plaat C: schaarste ——— */
  function clearScarcePressed() {
    scarceToggles.forEach((btn) => btn.setAttribute("aria-pressed", "false"));
    scarceForks.forEach((btn) => btn.setAttribute("aria-pressed", "false"));
  }

  function updateScarceFeedback(kind, id) {
    if (!scarceFeedback) return;
    if (!kind || !id) {
      scarceFeedback.innerHTML = "";
      highlightCards([]);
      return;
    }

    if (kind === "scarce") {
      const c = SCARCE_CONTENT[id];
      if (!c) return;
      scarceFeedback.innerHTML = renderLensCard({
        title: c.title,
        line: c.line,
        ask: c.ask,
        steps: c.steps,
        forks: c.forks,
        domains: c.domains,
        gotoLabel: "Open op Jullie pad →"
      });
    } else if (kind === "fork") {
      const c = FORK_CONTENT[id];
      if (!c) return;
      scarceFeedback.innerHTML = renderLensCard({
        title: c.title,
        line: "Instap onder druk — zelfde mechanisme als op de keten. Uitwerking op Jullie pad.",
        ask: c.questions[0],
        steps: [],
        forks: [id],
        domains: domainsForSelection([], [id]),
        gotoLabel: "Markeer “" + c.title + "” op Jullie pad →"
      });
    }
    bindGotoButtons(scarceFeedback);
  }

  scarceToggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const wasOn = btn.getAttribute("aria-pressed") === "true";
      clearScarcePressed();
      if (wasOn) {
        updateScarceFeedback(null, null);
        return;
      }
      btn.setAttribute("aria-pressed", "true");
      updateScarceFeedback("scarce", btn.dataset.scarce);
    });
  });

  scarceForks.forEach((btn) => {
    btn.addEventListener("click", () => {
      const wasOn = btn.getAttribute("aria-pressed") === "true";
      clearScarcePressed();
      if (wasOn) {
        updateScarceFeedback(null, null);
        return;
      }
      btn.setAttribute("aria-pressed", "true");
      updateScarceFeedback("fork", btn.dataset.fork);
    });
  });

  /* ——— Tabs, filters, D ——— */
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => setPlate(btn.dataset.plate || "d"));
  });

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => setFilter(btn.dataset.filter || "all"));
  });

  pathSteps.forEach((btn) => {
    btn.addEventListener("click", () => {
      const on = btn.getAttribute("aria-pressed") === "true";
      btn.setAttribute("aria-pressed", on ? "false" : "true");
      updatePathFeedback();
    });
  });

  forkBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const on = btn.getAttribute("aria-pressed") === "true";
      btn.setAttribute("aria-pressed", on ? "false" : "true");
      updatePathFeedback();
    });
  });

  if (pathReset) pathReset.addEventListener("click", resetPath);

  let initial = "d";
  try {
    const v = new URL(window.location.href).searchParams.get("v");
    if (v && ["a", "b", "c", "d"].includes(v.toLowerCase())) {
      initial = v.toLowerCase();
    }
  } catch (_) {
    /* ignore */
  }

  setPlate(initial);
  setFilter("all");
  updatePathFeedback();
})();
