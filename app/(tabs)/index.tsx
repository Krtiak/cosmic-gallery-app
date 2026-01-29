import { APODCard } from '@/src/components/APODCard';
import { APODGallery } from '@/src/components/APODGallery';
import { useAPOD } from '@/src/hooks/useAPOD';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export default function HomeScreen() {
  const { apod, loading, error, history, selectFromHistory } = useAPOD();
  const [galleryVisible, setGalleryVisible] = useState(false);
  const rotation = useSharedValue(0);

  const handleMenuPress = () => {
    rotation.value = withTiming(galleryVisible ? 0 : 45, { duration: 300 });
    setGalleryVisible(!galleryVisible);
  };

  const animatedMenuStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={styles.container}>
      {/* Hamburger menu s liquid glass efektom */}
      <View style={styles.headerContainer}>
        <Animated.View
          style={[styles.menuButtonBackground, animatedMenuStyle]}
        >
          <TouchableOpacity
            style={styles.menuButton}
            onPress={handleMenuPress}
          >
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* APODCard - hlavný obsah */}
      <APODCard data={apod} loading={loading} error={error} />

      {/* Galéria modal */}
      <APODGallery
        visible={galleryVisible}
        history={history}
        onSelect={selectFromHistory}
        onClose={() => handleMenuPress()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151718',
  },
  headerContainer: {
    position: 'absolute',
    top: 85,
    right: 12,
    zIndex: 10,
  },
  menuButtonBackground: {
    backgroundColor: 'rgba(0, 212, 255, 0.15)',
    borderRadius: 50,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
    shadowColor: '#00d4ff',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  menuButton: {
    width: 28,
    height: 28,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  hamburgerLine: {
    width: 24,
    height: 2.5,
    backgroundColor: '#00d4ff',
    borderRadius: 2,
  },
});

