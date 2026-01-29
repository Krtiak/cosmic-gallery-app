declare module 'react-native-wallpaper-manager' {
  export function setWallpaper(
    uri: string,
    wallpaperType?: 'home' | 'lock' | 'both'
  ): Promise<string>;

  export default {
    setWallpaper,
  };
}
