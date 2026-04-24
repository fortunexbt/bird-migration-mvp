import './App.css'

type Signal = 'Live observations' | 'Recent sightings' | 'Seasonal estimate'
type Status = 'Peak now' | 'Active now' | 'Early arrivals possible' | 'Outside expected window'

type Species = {
  id: string
  name: string
  latin: string
  distanceKm: number
  lastSeen: string
  status: Status
  notable?: boolean
  signal: Signal[]
  summary: string
}

const species: Species[] = [
  {
    id: 'barn-swallow',
    name: 'Barn Swallow',
    latin: 'Hirundo rustica',
    distanceKm: 4.2,
    lastSeen: '12 min ago',
    status: 'Peak now',
    signal: ['Recent sightings', 'Seasonal estimate'],
    summary: 'Multiple reports across open fields. Fast-moving aerial feeder; strong spring passage signal.',
  },
  {
    id: 'yellow-warbler',
    name: 'Yellow Warbler',
    latin: 'Setophaga petechia',
    distanceKm: 7.8,
    lastSeen: '48 min ago',
    status: 'Active now',
    signal: ['Live observations', 'Recent sightings', 'Seasonal estimate'],
    summary: 'Observed along riparian edge. Migration window active for this latitude band.',
  },
  {
    id: 'black-tern',
    name: 'Black Tern',
    latin: 'Chlidonias niger',
    distanceKm: 18.4,
    lastSeen: '2 h ago',
    status: 'Early arrivals possible',
    notable: true,
    signal: ['Recent sightings', 'Seasonal estimate'],
    summary: 'Uncommon local report near wetland basin. Good candidate for notable alert.',
  },
]

const chips = [
  'Recent sightings nearby',
  'Migration window active',
  'Optional alerts',
  'Location private by default',
]

function App() {
  const hero = species[0]

  return (
    <div className="shell">
      <header className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Bird migration MVP</p>
          <h1>See what is moving near you before the birds are gone.</h1>
          <p className="lede">
            A production-ready MVP spec and launch page for casual birdwatchers. Clear signal labeling.
            No fake real-time claims. Built for fast local awareness.
          </p>
          <div className="chip-row">
            {chips.map((chip) => (
              <span className="chip" key={chip}>
                {chip}
              </span>
            ))}
          </div>
        </div>
        <div className="hero-card">
          <p className="card-label">Near your current location</p>
          <h2>{hero.name}</h2>
          <p className="latin">{hero.latin}</p>
          <div className="metrics">
            <div>
              <span className="metric-label">Distance</span>
              <strong>{hero.distanceKm} km</strong>
            </div>
            <div>
              <span className="metric-label">Last seen</span>
              <strong>{hero.lastSeen}</strong>
            </div>
            <div>
              <span className="metric-label">Status</span>
              <strong>{hero.status}</strong>
            </div>
          </div>
          <p className="summary">{hero.summary}</p>
        </div>
      </header>

      <main className="grid">
        <section className="panel map-panel">
          <div className="panel-heading">
            <div>
              <p className="section-kicker">Map view</p>
              <h3>Migration activity around a 25 km search radius</h3>
            </div>
            <span className="badge">Default radius: 25 km</span>
          </div>
          <div className="map-box">
            <div className="ring ring-1" />
            <div className="ring ring-2" />
            <div className="pin pin-a">Barn Swallow</div>
            <div className="pin pin-b">Yellow Warbler</div>
            <div className="pin pin-c">Black Tern</div>
            <div className="user-dot" />
          </div>
          <p className="footnote">
            Labels must distinguish live observations, recent sightings, and seasonal migration estimates.
          </p>
        </section>

        <section className="panel list-panel">
          <div className="panel-heading">
            <div>
              <p className="section-kicker">Nearby migrating species</p>
              <h3>Ranked by local activity and seasonal relevance</h3>
            </div>
            <span className="badge muted">Updated 4:53 PM</span>
          </div>
          <div className="species-list">
            {species.map((bird) => (
              <article className="species-card" key={bird.id}>
                <div className="species-top">
                  <div>
                    <h4>{bird.name}</h4>
                    <p>{bird.latin}</p>
                  </div>
                  <div className="species-meta">
                    {bird.notable ? <span className="badge alert">Notable</span> : null}
                    <span className="status">{bird.status}</span>
                  </div>
                </div>
                <p className="summary">{bird.summary}</p>
                <div className="signal-row">
                  {bird.signal.map((item) => (
                    <span className="signal" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
                <div className="species-bottom">
                  <span>{bird.distanceKm} km away</span>
                  <span>Seen {bird.lastSeen}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel details-panel">
          <div className="panel-heading">
            <div>
              <p className="section-kicker">MVP scope</p>
              <h3>What ships first</h3>
            </div>
          </div>
          <ul className="scope-list">
            <li>Foreground location permission only</li>
            <li>Fallback to city or map-center search if location denied</li>
            <li>Recent sightings feed + seasonal migration rules</li>
            <li>Species detail pages with confidence labels</li>
            <li>Low-noise alerts for first-of-season and notable activity</li>
            <li>Offline cache of last successful area query</li>
          </ul>
        </section>

        <section className="panel details-panel">
          <div className="panel-heading">
            <div>
              <p className="section-kicker">Deployment</p>
              <h3>Ready for Railway static hosting</h3>
            </div>
          </div>
          <ul className="scope-list">
            <li>Vite + React + TypeScript single-page frontend</li>
            <li>Build command: <code>npm run build</code></li>
            <li>Output directory: <code>dist</code></li>
            <li>Can later grow into mobile app + API backend without rewrite</li>
          </ul>
        </section>
      </main>
    </div>
  )
}

export default App
