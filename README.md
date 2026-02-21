# Real Estate Mobile App

A modern real estate mobile application built with React Native, Expo SDK 54, and Appwrite as the backend.

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React Native + Expo SDK 54 (New Architecture) |
| **Navigation** | Expo Router 6 (file-based, App Router style) |
| **Styling** | NativeWind v4 (Tailwind CSS for React Native) |
| **Backend** | Appwrite (auth, database, storage) |
| **Auth** | Google OAuth via Appwrite |
| **State** | React Context API (`GlobalProvider`) |
| **Data Fetching** | Custom `useAppwrite` hook |

## Implemented Screens and Features

- **Sign In screen** — Google OAuth authentication with redirect on success
- **Home tab** — Featured property carousel + filterable property grid with search and category filters
- **Explore tab** — Browse all listings with real-time search and filter support
- **Property Detail screen** — Full property page with image, stats (bedrooms, bathrooms, area), facilities, overview, location, and a Book Now CTA
- **Profile tab** — User avatar, name, settings menu (Bookings, Payments, Notifications, Security, Language, Help Center, Invite Friends), and logout

## Project Structure

```
app/
  _layout.tsx                  # Root layout: fonts, splash screen, GlobalProvider, Stack
  sign-in.tsx                  # Google OAuth sign-in screen
  (root)/
    _layout.tsx                # Protected layout with auth redirect
    (tabs)/
      _layout.tsx              # Bottom tab bar (Home, Explore, Profile)
      index.tsx                # Home tab — featured + recommended properties
      explore.tsx              # Explore tab — full property search
      profile.tsx              # Profile tab — user info and settings
    properties/
      [id].tsx                 # Property detail page (dynamic route)

lib/
  appwrite.ts                  # Appwrite client, auth (login/logout/getCurrentUser), DB queries
  useAppwrite.ts               # Generic data-fetching hook with loading/refetch state
  global-provider.tsx          # Auth context: isLoggedIn, user, loading, refetch
  seed.ts                      # Database seeding utility
  data.ts                      # Additional data helpers

constants/
  images.ts                    # PNG image barrel exports
  icons.ts                     # PNG icon barrel exports
  data.ts                      # Static data: categories, settings, facilities, gallery, mock cards
```

## Getting Started

```bash
npm install
```

Configure your Appwrite project — set your endpoint, project ID, and database/collection IDs in `lib/appwrite.ts`.

```bash
npm expo start       # Start Expo dev server (scan QR with Expo Go)
```