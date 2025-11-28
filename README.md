# 🌙 Noor Halo - Inner Wellness App

**Noor Halo** is a mobile wellness application that blends gentle habits, rituals, guided audio, inspirational quotes, and a cosmic, calming aesthetic to promote inner peace, balance, and spiritual well-being.

---

## ✨ Core Identity

Noor Halo is built on **three pillars**:

1. **Inner Light** — Connect with your inner radiance
2. **Balance** — Cultivate harmony in daily life  
3. **Modern Serenity** — Contemporary spiritual wellness

### Design Philosophy
- **Cosmic & Calming** — Night sky gradients, soft purple/pink halos, gentle animations
- **Non-religious** — Universal spiritual approach
- **Minimal & Elegant** — Clean interface, thoughtful interactions

---

## 📱 V1 Features

### 1. **Splash Screen**
- Animated halo pulse with fade-in effect
- Smooth transition to onboarding or home

### 2. **Onboarding** (3 Slides)
- Slide 1: "Discover Your Inner Light"
- Slide 2: "Build Gentle Rituals"  
- Slide 3: "Illuminate Your Everyday"
- Swipeable carousel with skip option

### 3. **Home Dashboard**
- Daily ritual card
- Quick access grid (Audio, Quotes, Habits, Challenges)
- Daily inspirational quote
- Animated halo background

### 4. **Habits Tracker**
- ✅ Add/edit/delete habits
- 📅 Daily/Weekly/Custom frequency
- 🔥 Streak tracking
- 🎨 Icon selection (12 icons)
- ✓ Mark habits complete/incomplete
- 📊 Progress visualization

### 5. **Rituals Library** (20 Rituals)
- Browse 20 pre-loaded rituals
- Detailed view with intention, duration, description
- Add/remove from "My Rituals"
- Animated halo effects

### 6. **Guided Audio** (10 Tracks)
- Text-to-speech (TTS) demo audio
- Audio player with halo animation
- Play/pause controls
- Track library organized by duration (1min, 3min, 5min)

### 7. **Daily Quotes** (30 Quotes)
- Swipeable quote carousel
- Share to social media (Instagram, WhatsApp)
- Navigation controls
- Quote counter

### 8. **Challenges** (7 Challenges)
- 7-day challenge programs
- Day-by-day task tracking
- Progress bars
- Badge system (placeholder)
- Complete/restart functionality

### 9. **Mood Tracker**
- 5 mood levels (emojis)
- Daily mood logging
- Optional notes
- Weekly mood chart visualization
- Mood history

### 10. **Settings**
- 🌍 Language switcher (English, French, Arabic)
- 🌓 Theme toggle (Light/Dark - Dark enforced in V1)
- 🔔 Notification toggles
- 🔄 Reset habits option
- ℹ️ Version, Credits, Privacy Policy links

---

## 🛠️ Tech Stack

### Frontend
- **React Native** with **Expo**
- **TypeScript**
- **Expo Router** (file-based routing)
- **React Navigation** (@react-navigation/bottom-tabs)
- **i18next** (Internationalization)
- **AsyncStorage** (Local data persistence)
- **expo-av** (Audio playback)
- **expo-speech** (Text-to-speech)
- **react-native-reanimated** (Animations)
- **expo-linear-gradient** (Gradients)
- **date-fns** (Date utilities)

### Styling
- Custom theme system
- Color palette: Deep Purple (#2B1E4A), Soft Purple Glow (#8A4FFF), Pink Halo (#FCA9FF)
- Typography: Poppins (titles), Inter (body)
- 8pt grid spacing system

### Data & State
- **AsyncStorage** for all user data (V1)
- Firebase config ready (not active in V1)
- Local JSON data files for content

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Yarn or npm
- Expo CLI
- Expo Go app (for mobile testing)

### Installation

```bash
cd /app/frontend
yarn install
```

### Running the App

```bash
# Development
yarn start

# Specific platforms
yarn ios     # iOS simulator
yarn android # Android emulator
yarn web     # Web browser
```

### Testing on Mobile
1. Install **Expo Go** on your device
2. Scan the QR code from terminal
3. App will load on your device

---

## 📄 Content Replacement

### Rituals
Edit `/data/rituals.json` with your final 20 rituals

### Quotes
Edit `/data/quotes.json` with your final 30 quotes

### Challenges
Edit `/data/challenges.json` with your final 7 challenges

### Audio Files
Replace TTS with real audio:
1. Add `.mp3` files to `/assets/audio/`
2. Update file paths in `/app/(tabs)/audio.tsx`
3. Replace TTS implementation with expo-av

---

## 🔮 Firebase Setup (Optional for V2)

Add Firebase credentials to `.env`:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Then call `initializeFirebase()` in `app/_layout.tsx`

---

## 🌐 Languages

- **English** — Default
- **Français** — French
- **العربية** — Arabic (RTL supported)

Change language in Settings.

---

## 🎨 Brand Colors

```typescript
deepPurple: '#2B1E4A'
softPurpleGlow: '#8A4FFF'
pinkHalo: '#FCA9FF'
nightSkyStart: '#1a0b2e'
```

---

## 🌟 What's Working

✅ All 10 screens fully functional  
✅ Splash → Onboarding → Home flow  
✅ Habits CRUD with streak tracking  
✅ Rituals library with favorites  
✅ Audio player with TTS  
✅ Quotes with sharing  
✅ 7 Challenges with progress tracking  
✅ Mood tracker with charts  
✅ Settings with language switching  
✅ i18n (EN/FR/AR with RTL)  
✅ AsyncStorage for data persistence  
✅ Animated halo effects  
✅ Cosmic theme throughout  

---

## 📋 Next Steps

1. **Replace placeholder content** (rituals, quotes, challenges, audio)
2. **Add Firebase credentials** (if using cloud sync)
3. **Test on real devices** via Expo Go
4. **Customize branding** (app icons, splash screen)
5. **Set up notifications** (native permissions)

---

## 🙏 Credits

Built with ❤️ for **Noor Halo**  
Design inspired by Calm & Headspace with a cosmic twist 🌙✨

---

**Ready to illuminate your inner light!** 🚀
