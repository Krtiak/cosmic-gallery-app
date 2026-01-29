import * as FileSystem from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { APODData } from '../services/apodService';

interface APODCardProps {
  data: APODData | null;
  loading: boolean;
  error: string | null;
}

export function APODCard({ data, loading, error }: APODCardProps) {
  const [downloading, setDownloading] = useState(false);

  const handleSetWallpaper = async () => {
    if (!data || data.media_type !== 'image') return;

    try {
      setDownloading(true);
      console.log('Downloading wallpaper:', data.title);

      // Download to documents directory
      const fileName = `apod_${data.date}.jpg`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      console.log('Downloading to:', fileUri);

      // Download the image
      const downloadResult = await FileSystem.downloadAsync(data.url, fileUri);
      
      if (downloadResult.status === 200) {
        // Try to open Android wallpaper chooser
        try {
          await IntentLauncher.startActivityAsync('android.intent.action.SET_WALLPAPER', {
            data: downloadResult.uri,
          });
        } catch (err) {
          console.log('Wallpaper intent failed, opening viewer');
          await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
            data: downloadResult.uri,
            type: 'image/*',
          });
        }
      }
      
      setDownloading(false);
    } catch (err) {
      setDownloading(false);
      console.error('Download error:', err);
      Alert.alert('Chyba', `Nepodarilo sa: ${err}`);
    }
  };


  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00d4ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>❌ Chyba: {error}</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Žiadne dáta dostupné</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Obrázok na celú šírku */}
      {data.media_type === 'image' ? (
        <Image
          source={{ uri: data.url }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.videoPlaceholder}>
          <Text style={styles.videoText}>🎬 Video obsah</Text>
        </View>
      )}

      {/* Info v spodnej časti */}
      <View style={styles.infoContainer}>
        <Text style={styles.date}>{data.date}</Text>
        <Text style={styles.title}>{data.title}</Text>
        
        {/* Tlačidlo na nastavenie wallpaperu */}
        {data.media_type === 'image' && (
          <TouchableOpacity
            style={styles.wallpaperButton}
            onPress={handleSetWallpaper}
            disabled={downloading}
          >
            <Text style={styles.wallpaperButtonText}>
              {downloading ? 'Saving…' : 'Set as wallpaper'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '75%',
  },
  videoPlaceholder: {
    width: '100%',
    height: '75%',
    backgroundColor: '#0f3460',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  date: {
    color: '#00d4ff',
    fontSize: 12,
    marginBottom: 6,
    fontWeight: '600',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  copyright: {
    color: '#888',
    fontSize: 11,
    fontStyle: 'italic',
  },
  wallpaperButton: {
    backgroundColor: '#00d4ff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 4,
  },
  wallpaperButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
  },
});
