# 🌌 Cosmic Gallery

**Cosmic Gallery** is a mobile application that brings the wonders of space directly to your Android device. Every day, discover stunning astronomical imagery from NASA's Astronomy Picture of the Day (APOD) collection, save your favorites to your gallery, and transform your phone's wallpaper into a breathtaking cosmic masterpiece.

## ✨ Features

- 📸 **Daily Space Photos** - Automatically fetches NASA's Astronomy Picture of the Day
- 💾 **Save to Gallery** - Download high-resolution images directly to your device
- 🖼️ **Wallpaper Integration** - Set cosmic images as your phone wallpaper with a single tap
- 📚 **History Gallery** - Browse through previously viewed APOD images in a beautiful grid layout
- 🌙 **Dark Theme** - Optimized dark interface that complements astronomical imagery
- 🎨 **Responsive Design** - Seamless experience across different screen sizes

## 🚀 How It Works

1. **Fetch** - The app connects to NASA's APOD API to retrieve the astronomical picture of the day
2. **Display** - View stunning space photography with detailed descriptions and metadata
3. **Save** - Download images directly to your device's gallery for offline access
4. **Customize** - Set any saved image as your phone's wallpaper through the system dialog

## 📱 Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Routing**: Expo Router (file-based navigation)
- **API**: NASA APOD API
- **Storage**: AsyncStorage for image history
- **File Management**: expo-file-system for downloads
- **UI**: Custom components with responsive design

## 🛠️ Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Android Studio (for Android development)
- EAS CLI (for production builds)

### Setup

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/cosmic-gallery-app.git
   cd cosmic-gallery-app
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm start
   ```

4. Run on Android
   ```bash
   npm run android
   ```

## 📦 Building for Production

### Create APK/AAB for Google Play Store

```bash
# Build production APK
eas build --platform android --profile preview

# Build production AAB (for Play Store submission)
eas build --platform android --profile production
```

## 🎨 Project Structure

```
cosmic-gallery/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Main home screen
│   │   └── _layout.tsx    # Tab layout configuration
│   ├── _layout.tsx        # Root layout
│   └── modal.tsx          # Modal screens
├── src/
│   ├── components/        # React components
│   │   ├── APODCard.tsx   # Main photo display component
│   │   └── APODGallery.tsx # History gallery component
│   ├── hooks/             # Custom React hooks
│   │   └── useAPOD.ts     # APOD data fetching hook
│   ├── services/          # API and storage services
│   │   ├── apodService.ts # NASA APOD API integration
│   │   └── historyService.ts # AsyncStorage management
│   └── utils/             # Utility functions
├── assets/                # Images, icons, fonts
└── app.json              # Expo configuration
```

## 🌐 API Reference

This app uses NASA's official APOD API:
- **Endpoint**: `https://api.nasa.gov/planetary/apod`
- **Documentation**: [NASA APOD API Docs](https://api.nasa.gov/)

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **NASA** for providing the incredible APOD API and astronomical imagery
- **Expo** for the amazing React Native framework
- All the astronomers and astrophotographers whose work is featured

## 📞 Contact

For questions or feedback, please open an issue on GitHub.

---

**Made with ❤️ and ✨ by exploring the cosmos, one photo at a time.**
