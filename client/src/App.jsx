import { useState, useEffect, useRef } from 'react'
import {
  Heart,
  X,
  Users,
  Compass,
} from 'lucide-react'
import './App.css'

const API_URL = 'http://localhost:5000'

function App() {
  const [activeTab, setActiveTab] = useState('discover')
  const [profiles, setProfiles] = useState([])
  const [matches, setMatches] = useState([])
  const [showMatch, setShowMatch] = useState(false)
  const [matchedProfile, setMatchedProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [swipeDirection, setSwipeDirection] = useState('')
  const [dragX, setDragX] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)

  const startX = useRef(null)

  // Load profiles and matches from the backend
  useEffect(() => {
    const loadData = async () => {
      try {
        const [feedResponse, matchesResponse] = await Promise.all([
          fetch(`${API_URL}/feed`),
          fetch(`${API_URL}/matches`),
        ])

        if (!feedResponse.ok || !matchesResponse.ok) {
          throw new Error('Unable to load data from the server.')
        }

        const feedData = await feedResponse.json()
        const matchesData = await matchesResponse.json()

        setProfiles(feedData)
        setMatches(matchesData)
      } catch {
        setError(
          'Could not connect to the server. Please check if the backend is running.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const currentProfile = profiles[0]

  // Handle Like and Pass actions
  const handleSwipe = async (action) => {
    if (!currentProfile || isSwiping) return

    setIsSwiping(true)
    setSwipeDirection(action === 'like' ? 'right' : 'left')
    setError('')

    // Wait for the swipe animation to finish
    await new Promise((resolve) => setTimeout(resolve, 250))

    try {
      const response = await fetch(`${API_URL}/swipe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId: currentProfile.id,
          action: action,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Swipe could not be saved.')
      }

      // Remove the swiped profile from the feed
      setProfiles((previous) =>
        previous.filter((profile) => profile.id !== currentProfile.id)
      )

      setSwipeDirection('')
      setDragX(0)

      // Show a match only when the backend confirms it
      if (result.match) {
        setMatchedProfile(result.profile)
        setMatches((previous) => [...previous, result.profile])
        setShowMatch(true)
      }
    } catch (err) {
      setSwipeDirection('')
      setDragX(0)
      setError(err.message)
    } finally {
      setIsSwiping(false)
      startX.current = null
    }
  }

  // Start dragging the profile card
  const handlePointerDown = (event) => {
    if (isSwiping) return

    startX.current = event.clientX
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  // Move the card while dragging
  const handlePointerMove = (event) => {
    if (startX.current === null || isSwiping) return

    setDragX(event.clientX - startX.current)
  }

  // Decide whether to Like, Pass or return the card
  const handlePointerUp = () => {
    if (startX.current === null || isSwiping) return

    if (dragX > 100) {
      handleSwipe('like')
    } else if (dragX < -100) {
      handleSwipe('pass')
    } else {
      setDragX(0)
      startX.current = null
    }
  }

  const closeMatch = () => {
    setShowMatch(false)
    setMatchedProfile(null)
  }

  // Card animation
  const cardStyle = {
    transform: swipeDirection
      ? `translateX(${swipeDirection === 'right' ? '600px' : '-600px'}) rotate(${swipeDirection === 'right' ? '20deg' : '-20deg'})`
      : `translateX(${dragX}px) rotate(${dragX / 20}deg)`,
    transition: swipeDirection
      ? 'transform 0.25s ease'
      : 'none',
    touchAction: 'pan-y',
  }

  // Swipe feedback intensity
  const swipeIntensity = Math.min(Math.abs(dragX) / 100, 1)

  const swipeFeedbackStyle = {
    position: 'absolute',
    top: '25%',
    left: '50%',
    transform: `translate(-50%, -50%) scale(${0.7 + swipeIntensity * 0.3})`,
    opacity: swipeIntensity,
    zIndex: 20,
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.1s ease, transform 0.1s ease',
  }

  return (
    <div className="app">

      <header className="navbar">
        <div className="brand">
          coy<span>.</span>
        </div>
      </header>

      <main className="main-container">

        <nav className="tabs">
          <button
            className={activeTab === 'home' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('home')}
          >
            Home
          </button>

          <button
            className={activeTab === 'discover' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('discover')}
          >
            <Compass size={17} />
            Discover
          </button>

          <button
            className={activeTab === 'matches' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('matches')}
          >
            <Users size={17} />
            Matches
            {matches.length > 0 && (
              <span className="match-count">{matches.length}</span>
            )}
          </button>
        </nav>

        {activeTab === 'discover' && (
          <section className="discover-page">

            <div className="section-heading">
              <div>
                <p className="eyebrow">YOUR NEXT CONNECTION</p>
                <h1>Discover</h1>
                <p className="subtitle">
                  Someone interesting might be around.
                </p>
              </div>

              <div className="profile-counter">
                {profiles.length} left
              </div>
            </div>

            {loading ? (
              <div className="empty-state">
                <h2>Loading profiles...</h2>
              </div>
            ) : error && profiles.length === 0 ? (
              <div className="empty-state">
                <h2>Unable to load profiles</h2>
                <p>{error}</p>
              </div>
            ) : currentProfile ? (
              <div
                className="profile-card"
                style={cardStyle}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
              >

                {/* Swipe feedback */}
                {Math.abs(dragX) > 10 && (
                  <div style={swipeFeedbackStyle}>
                    {dragX > 0 ? (
                      <Heart
                        size={90}
                        strokeWidth={2.5}
                        fill="#FF3680"
                        color="#FF3680"
                        style={{
                          filter: `
                            drop-shadow(0 0 8px #FF3680)
                            drop-shadow(0 0 18px rgba(255, 54, 128, 0.8))
                            drop-shadow(0 0 35px rgba(255, 54, 128, 0.5))
                          `,
                        }}
                      />
                    ) : (
                      <X
                        size={90}
                        strokeWidth={3}
                        color="#A78BFA"
                        style={{
                          filter: `
                            drop-shadow(0 0 8px #A78BFA)
                            drop-shadow(0 0 18px rgba(167, 139, 250, 0.8))
                            drop-shadow(0 0 35px rgba(167, 139, 250, 0.5))
                          `,
                        }}
                      />
                    )}
                  </div>
                )}

                <div className="profile-image-container">
                  <img
                    src={currentProfile.image}
                    alt={currentProfile.name}
                    className="profile-image"
                    draggable="false"
                  />

                  <div className="image-gradient"></div>

                  <div className="profile-name">
                    <h2>
                      {currentProfile.name}, {currentProfile.age}
                    </h2>
                    <p>{currentProfile.city}</p>
                  </div>
                </div>

                <div className="profile-details">
                  <h3>About me</h3>
                  <p>{currentProfile.bio}</p>

                  <h3>Interests</h3>
                  <div className="interests">
                    {currentProfile.interests.map((interest) => (
                      <span key={interest}>{interest}</span>
                    ))}
                  </div>
                </div>

                <div className="swipe-actions">
                  <button
                    className="pass-button"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={() => handleSwipe('pass')}
                    aria-label="Pass profile"
                    disabled={isSwiping}
                  >
                    <X size={27} />
                  </button>

                  <button
                    className="like-button"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={() => handleSwipe('like')}
                    aria-label="Like profile"
                    disabled={isSwiping}
                  >
                    <Heart size={27} fill="white" />
                  </button>
                </div>

                <p className="swipe-hint">
                  Pass or like to discover someone else
                </p>

              </div>
            ) : (
              <div className="empty-state">
                <h2>You've seen everyone!</h2>
                <p>Come back later to discover more people.</p>
              </div>
            )}

            {error && profiles.length > 0 && (
              <p className="subtitle">{error}</p>
            )}

          </section>
        )}

        {activeTab === 'matches' && (
          <section className="matches-page">
            <h1>Your matches</h1>
            <p className="subtitle">
              Your mutual connections appear here.
            </p>

            {matches.length === 0 ? (
              <div className="empty-state">
                <Heart size={42} />
                <h2>No matches yet</h2>
                <p>Keep discovering to find a mutual connection.</p>
                <button
                  className="primary-button"
                  onClick={() => setActiveTab('discover')}
                >
                  Discover people
                </button>
              </div>
            ) : (
              matches.map((match) => (
                <div className="match-item" key={match.id}>
                  <img src={match.image} alt={match.name} />

                  <div>
                    <h3>{match.name}, {match.age}</h3>
                    <p>It's a match!</p>
                  </div>
                </div>
              ))
            )}
          </section>
        )}

      </main>

      {showMatch && matchedProfile && (
        <div className="match-overlay">
          <div className="match-modal">
            <div className="match-heart">
              <Heart size={48} fill="#ff3680" color="#ff3680" />
            </div>

            <h1>It's a match!</h1>

            <p>
              You and {matchedProfile.name} liked each other.
            </p>

            <button className="primary-button" onClick={closeMatch}>
              Continue discovering
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default App