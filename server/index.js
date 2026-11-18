
const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

// File paths
const profilesFile = path.join(__dirname, 'data', 'profiles.json')
const swipesFile = path.join(__dirname, 'data', 'swipes.json')

// Read data from JSON files
const getProfiles = () => {
  return JSON.parse(fs.readFileSync(profilesFile, 'utf8'))
}

const getSwipes = () => {
  return JSON.parse(fs.readFileSync(swipesFile, 'utf8'))
}

// Save swipe data
const saveSwipes = (data) => {
  fs.writeFileSync(swipesFile, JSON.stringify(data, null, 2))
}

// Test route
app.get('/', (req, res) => {
  res.send('Coy backend is running!')
})

// GET /feed
// Returns profiles that the user has not swiped yet.
app.get('/feed', (req, res) => {
  const profiles = getProfiles()
  const swipeData = getSwipes()

  const swipedIds = swipeData.swipes.map((swipe) => swipe.profileId)

  const remainingProfiles = profiles
    .filter((profile) => !swipedIds.includes(profile.id))
    .map(({ likedUser, ...profile }) => profile)

  res.json(remainingProfiles)
})

// POST /swipe
// Saves a like or pass and checks for a mutual match.
app.post('/swipe', (req, res) => {
  const { profileId, action } = req.body

  if (!profileId || !['like', 'pass'].includes(action)) {
    return res.status(400).json({
      message: 'Please provide a valid profile ID and action.',
    })
  }

  const profiles = getProfiles()
  const swipeData = getSwipes()

  const profile = profiles.find((item) => item.id === Number(profileId))

  if (!profile) {
    return res.status(404).json({
      message: 'Profile not found.',
    })
  }

  const alreadySwiped = swipeData.swipes.some(
    (swipe) => swipe.profileId === profile.id
  )

  if (alreadySwiped) {
    return res.status(409).json({
      message: 'You have already swiped on this profile.',
    })
  }

  // Save the user's swipe
  swipeData.swipes.push({
    profileId: profile.id,
    action: action,
  })

  saveSwipes(swipeData)

  // A match happens only when both users have liked each other.
  const isMatch = action === 'like' && profile.likedUser === true

  if (isMatch) {
    const { likedUser, ...matchProfile } = profile

    return res.json({
      message: "It's a match!",
      match: true,
      profile: matchProfile,
    })
  }

  res.json({
    message: 'Swipe saved successfully.',
    match: false,
  })
})

// GET /matches
// Returns only mutual matches.
app.get('/matches', (req, res) => {
  const profiles = getProfiles()
  const swipeData = getSwipes()

  const matchedProfiles = swipeData.swipes
    .filter((swipe) => {
      const profile = profiles.find(
        (item) => item.id === swipe.profileId
      )

      return (
        swipe.action === 'like' &&
        profile &&
        profile.likedUser === true
      )
    })
    .map((swipe) => {
      const profile = profiles.find(
        (item) => item.id === swipe.profileId
      )

      const { likedUser, ...matchProfile } = profile
      return matchProfile
    })

  res.json(matchedProfiles)
})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})