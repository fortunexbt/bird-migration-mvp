
import './App.css'

type SignalType = 'Live observations' | 'Recent sightings' | 'Seasonal estimate'
type MigrationStatus = 'Peak now' | 'Active now' | 'Early arrivals possible' | 'Late stragglers possible'

type Species = {
  id: string
  name: string
  latin: string
  group: string
  distanceKm: number
  lastSeen: string
  count24h: number
  status: MigrationStatus
  confidence: 'High' | 'Medium'
  alert: string
  summary: string
  habitat: string
  signals: SignalType[]
  notable?: boolean
}

type ForecastBand = {
  label: string
  value: string
  detail: string
}

type StatTile = {
  label: string
  value: string
  note: string
}

const species: Species[] = [
  {
    id: 'barn-swallow',
    name: 'Barn Swallow',
    latin: 'Hirundo rustica',
    group: 'Aerial insectivore',
    distanceKm: 4.2,
    lastSeen: '12 min ago',
    count24h: 14,
    status: 'Peak now',
    confidence: 'High',
    alert: 'First strong local surge this week',
    habitat: 'Open fields, farm edges, wires',
    summary: 'Clustered reports across open ground. Strong spring passage signal with repeated flyover counts.',
    signals: ['Recent sightings', 'Seasonal estimate'],
  },
  {
    id: 'yellow-warbler',
    name: 'Yellow Warbler',
    latin: 'Setophaga petechia',
    group: 'Songbird migrant',
    distanceKm: 7.8,
    lastSeen: '48 min ago',
    count24h: 9,
    status: 'Active now',
    confidence: 'High',
    alert: 'Riparian corridor lighting up',
    habitat: 'Wet scrub, stream edges, willows',
    summary: 'Repeated reports along water and low brush. Seasonal window lines up with nearby observations.',
    signals: ['Live observations', 'Recent sightings', 'Seasonal estimate'],
  },
  {
    id: 'black-tern',
    name: 'Black Tern',
    latin: 'Chlidonias niger',
    group: 'Wetland migrant',
    distanceKm: 18.4,
    lastSeen: '2 h ago',
    count24h: 2,
    status: 'Early arrivals possible',
    confidence: 'Medium',
    alert: 'Notable nearby report',
    habitat: 'Marshes, shallow wetlands, reedbeds',
    summary: 'Sparse but credible wetland report. Worth watching if you are near marsh habitat before dusk.',
    signals: ['Recent sightings', 'Seasonal estimate'],
    notable: true,
  },
  {
    id: 'osprey',
    name: 'Osprey',
    latin: 'Pandion haliaetus',
    group: 'Raptor migrant',
    distanceKm: 21.1,
    lastSeen: '3 h ago',
    count24h: 4,
    status: 'Active now',
    confidence: 'High',
    alert: 'Coastal route picking up',
    habitat: 'Lakes, rivers, coast',
    summary: 'Recent flyover and perch reports suggest active movement through the wider corridor today.',
    signals: ['Recent sightings', 'Seasonal estimate'],
  },
]

const timeline = [
  { time: 'Open', title: 'Launch and permission prompt', text: 'Explain the value first. Ask for foreground location only. Default to a 25 km radius once granted.' },
  { time: '10s', title: 'Immediate local feed', text: 'Show a map, ranked species, and a crisp migration activity summary before the user needs to think.' },
  { time: 'Now', title: 'Trustworthy detail', text: 'Every card declares whether it is live-ish observation, recent sightings, or a seasonal estimate.' },
]

const alertRules = [
  'First-of-season alert: one recent sighting inside chosen radius, once per species per 30 days.',
  'High activity alert: 5+ migration-relevant species in 24h, deduped to one push per day.',
  'Notable species alert: provider-marked notable sighting within alert radius in the last 24h.',
]

const settings = [
  'Foreground location only by default',
  'Default search radius: 25 km',
  'Fallback to city, postcode, or map center if location denied',
  'Approximate location mode for privacy',
]

const sourceCards = [
  {
    title: 'Live observations',
    text: 'Only show when a provider supports near-real-time reporting. Human reports are live-ish, not exact movement telemetry.',
  },
  {
    title: 'Recent sightings',
    text: 'Primary MVP signal. Nearby observations from the last 24h to 7d, ranked by recency, density, and distance.',
  },
  {
    title: 'Seasonal estimate',
    text: 'Historical migration windows by species and geography. Useful, but explicitly approximate.',
  },
]

const forecastBands: ForecastBand[] = [
  {
    label: 'Tonight',
    value: 'Moderate passage',
    detail: 'Songbird migration likely after dusk if wind holds. Treat as regional estimate, not exact tracking.',
  },
  {
    label: 'Tomorrow dawn',
    value: 'Strong edge habitat activity',
    detail: 'Expect best field conditions around wet scrub and river margins during the first two hours of light.',
  },
  {
    label: 'Weekend',
    value: 'Broader raptor movement',
    detail: 'Thermal-friendly weather could improve visible migration along open ridge and shoreline corridors.',
  },
]


const statTiles: StatTile[] = [
  {
    label: 'Recent sightings',
    value: '27 in 24h',
    note: 'Human-reported local observations clustered inside the active search radius.',
  },
  {
    label: 'Seasonal confidence',
    value: 'High',
    note: 'Migration windows line up with current latitude and week-of-year rules.',
  },
  {
    label: 'Alert posture',
    value: 'Low noise',
    note: 'Only first-of-season, notable, or meaningful activity spikes make it through.',
  },
]

function App() {
  const hero = species[0]
  const notableCount = species.filter((bird) => bird.notable).length

  return (
    <div className="page-shell">
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <div className="grid-haze" />

      <header className="topbar">
        <div>
          <span className="brand-mark">Fieldguide</span>
          <p className="brand-sub">Migration intelligence for casual birdwatchers</p>
        </div>
        <nav className="topbar-nav">
          <a href="#dashboard">Dashboard</a>
          <a href="#forecast">Forecast</a>
          <a href="#sources">Data lanes</a>
        </nav>
        <div className="topbar-meta">
          <span className="pill success">Search radius 25 km</span>
          <span className="pill">Privacy-first</span>
        </div>
      </header>

      <main className="layout">
        <section className="hero-grid panel panel-glow">
          <div className="hero-copy">
            <p className="eyebrow">Bird migration near you</p>
            <h1>Beautiful local migration signal. No fake radar magic.</h1>
            <p className="hero-text">
              Casual birders need one sharp answer: what is moving around me right now, what is merely recent,
              and what is seasonally expected. This MVP makes those lanes obvious, fast, and trustworthy.
            </p>
            <div className="cta-row">
              <a className="cta-primary" href="#dashboard">
                Explore local activity
              </a>
              <a className="cta-secondary" href="#sources">
                View data labels
              </a>
            </div>
            <div className="stat-row">
              <article>
                <strong>{species.length}</strong>
                <span>migration-relevant species nearby</span>
              </article>
              <article>
                <strong>{notableCount}</strong>
                <span>notable sightings in current window</span>
              </article>
              <article>
                <strong>10s</strong>
                <span>target first-value time from cold open</span>
              </article>
            </div>
          </div>

          <aside className="hero-aside">
            <div className="spotlight-card">
              <div className="spotlight-top">
                <div>
                  <p className="micro-label">Current hotspot</p>
                  <h2>{hero.name}</h2>
                  <p className="latin">{hero.latin}</p>
                </div>
                <span className="pill success">{hero.status}</span>
              </div>

              <div className="spotlight-grid">
                <div>
                  <span className="micro-label">Distance</span>
                  <strong>{hero.distanceKm} km</strong>
                </div>
                <div>
                  <span className="micro-label">Last seen</span>
                  <strong>{hero.lastSeen}</strong>
                </div>
                <div>
                  <span className="micro-label">Reports, 24h</span>
                  <strong>{hero.count24h}</strong>
                </div>
                <div>
                  <span className="micro-label">Confidence</span>
                  <strong>{hero.confidence}</strong>
                </div>
              </div>

              <p className="spotlight-summary">{hero.summary}</p>

              <div className="signal-row">
                {hero.signals.map((signal) => (
                  <span className="signal-chip" key={signal}>
                    {signal}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section className="immersive-strip">
          <div className="strip-card compass-card">
            <span className="micro-label">Migration pulse</span>
            <strong>Moderate to strong</strong>
            <p>Most action is clustered near edge habitat and wet corridors. Good evening scan conditions.</p>
          </div>
          <div className="strip-card dial-card">
            <span className="micro-label">Nearby notable</span>
            <strong>{species[2].name}</strong>
            <p>{species[2].alert}. Keep expectations honest: one report is interesting, not certainty.</p>
          </div>
          <div className="strip-card privacy-card">
            <span className="micro-label">Location handling</span>
            <strong>Foreground only</strong>
            <p>Approximate mode supported. No background creep, no location-history nonsense.</p>
          </div>
        </section>


<section className="signal-matrix panel">
  <div className="panel-head">
    <div>
      <p className="eyebrow">Confidence matrix</p>
      <h3>Three data lanes. One honest answer.</h3>
    </div>
    <span className="pill">No exact real-time claim</span>
  </div>

  <div className="matrix-grid">
    {statTiles.map((tile) => (
      <article className="matrix-card" key={tile.label}>
        <span className="micro-label">{tile.label}</span>
        <strong>{tile.value}</strong>
        <p>{tile.note}</p>
      </article>
    ))}
  </div>
</section>

        <section className="dashboard-grid" id="dashboard">
          <section className="panel map-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Map + activity</p>
                <h3>Near your current location</h3>
              </div>
              <span className="pill">Updated 16:53 CEST</span>
            </div>

            <div className="map-stage">
              <div className="terrain terrain-one" />
              <div className="terrain terrain-two" />
              <div className="radius radius-large" />
              <div className="radius radius-medium" />
              <div className="radius radius-small" />
              <div className="user-core" />
              <div className="map-pin pin-one">
                <span>{species[0].name}</span>
                <strong>Peak now</strong>
              </div>
              <div className="map-pin pin-two">
                <span>{species[1].name}</span>
                <strong>River edge</strong>
              </div>
              <div className="map-pin pin-three">
                <span>{species[2].name}</span>
                <strong>Notable</strong>
              </div>
              <div className="map-pin pin-four">
                <span>{species[3].name}</span>
                <strong>Broader corridor</strong>
              </div>
              <div className="map-legend">
                <span><i className="dot dot-live" /> Live observations</span>
                <span><i className="dot dot-recent" /> Recent sightings</span>
                <span><i className="dot dot-seasonal" /> Seasonal estimate</span>
              </div>
            </div>

            <div className="activity-band">
              <div>
                <span className="micro-label">Activity level</span>
                <strong>Moderate to strong</strong>
              </div>
              <div>
                <span className="micro-label">Alert candidate</span>
                <strong>{species[2].alert}</strong>
              </div>
              <div>
                <span className="micro-label">Fallback</span>
                <strong>City or map-center search</strong>
              </div>
            </div>
          </section>

          <section className="panel species-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Nearby migrating species</p>
                <h3>Ranked by signal quality</h3>
              </div>
              <span className="pill success">Low-noise alerts ready</span>
            </div>

            <div className="species-stack">
              {species.map((bird) => (
                <article className="species-card" key={bird.id}>
                  <div className="species-header">
                    <div>
                      <div className="title-row">
                        <h4>{bird.name}</h4>
                        {bird.notable ? <span className="tag-warn">Notable</span> : null}
                      </div>
                      <p className="latin small">{bird.latin} · {bird.group}</p>
                    </div>
                    <span className="status-chip">{bird.status}</span>
                  </div>

                  <p className="species-summary">{bird.summary}</p>

                  <div className="species-metrics">
                    <span>{bird.distanceKm} km away</span>
                    <span>{bird.count24h} reports / 24h</span>
                    <span>Seen {bird.lastSeen}</span>
                  </div>

                  <div className="species-footer">
                    <span className="habitat-pill">{bird.habitat}</span>
                    <span className="confidence-pill">Confidence {bird.confidence}</span>
                  </div>

                  <div className="signal-row compact">
                    {bird.signals.map((signal) => (
                      <span className="signal-chip" key={signal}>
                        {signal}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>

        <section className="forecast-grid" id="forecast">
          <section className="panel forecast-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Seasonal migration outlook</p>
                <h3>What the next field window looks like</h3>
              </div>
              <span className="pill">Estimated, not exact</span>
            </div>

            <div className="forecast-stack">
              {forecastBands.map((band) => (
                <article className="forecast-card" key={band.label}>
                  <div>
                    <span className="micro-label">{band.label}</span>
                    <h4>{band.value}</h4>
                  </div>
                  <p>{band.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="panel journey-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Core user journey</p>
                <h3>Fast, clear, no bird-nerd tax</h3>
              </div>
            </div>

            <div className="timeline">
              {timeline.map((item) => (
                <article className="timeline-row" key={item.time}>
                  <span className="time-pill">{item.time}</span>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>

        <section className="insight-grid">
          <section className="panel rules-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Alert logic</p>
                <h3>Interesting, not spammy</h3>
              </div>
            </div>

            <ul className="rule-list">
              {alertRules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </section>

          <section className="panel settings-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Privacy + settings</p>
                <h3>Built to avoid creepy nonsense</h3>
              </div>
            </div>
            <ul className="rule-list compact-list">
              {settings.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </section>

        <section className="detail-grid">
          <section className="panel sources-panel" id="sources">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Data source lanes</p>
                <h3>Each signal says what it is</h3>
              </div>
            </div>
            <div className="source-grid">
              {sourceCards.map((card) => (
                <article className="source-card" key={card.title}>
                  <h4>{card.title}</h4>
                  <p>{card.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="panel deploy-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Ship status</p>
                <h3>Frontend ready to deploy</h3>
              </div>
            </div>
            <div className="deploy-block">
              <div>
                <span className="micro-label">Stack</span>
                <strong>Vite + React + TypeScript</strong>
              </div>
              <div>
                <span className="micro-label">Build</span>
                <strong>npm run build</strong>
              </div>
              <div>
                <span className="micro-label">Output</span>
                <strong>dist/</strong>
              </div>
            </div>
            <p className="deploy-copy">
              Hosting is blocked by local auth state, not by app readiness. Railway CLI is unauthorized here and Vercel CLI has no credentials loaded.
            </p>
          </section>
        </section>
      </main>
    </div>
  )
}

export default App
