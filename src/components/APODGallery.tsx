import { useMemo } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { APODHistoryItem } from '../services/historyService';

interface APODGalleryProps {
  visible: boolean;
  history: APODHistoryItem[];
  onSelect: (item: APODHistoryItem) => void;
  onClose: () => void;
  loading?: boolean;
}

const screenWidth = Dimensions.get('window').width;
const COLUMNS = screenWidth >= 360 ? 3 : 2;
const itemWidth = (screenWidth - 32) / COLUMNS;

export function APODGallery({
  visible,
  history,
  onSelect,
  onClose,
  loading = false,
}: APODGalleryProps) {
  const windowDimensions = useWindowDimensions();
  
  // Max 2 columns vždy
  const columns = 2;
  
  const itemDimension = useMemo(() => {
    return (windowDimensions.width - 24) / columns - 8;
  }, [windowDimensions.width]);
  const renderGalleryItem = ({ item, index }: { item: APODHistoryItem; index: number }) => (
    <TouchableOpacity
      style={[styles.galleryCard, { width: itemDimension, height: itemDimension }]}
      onPress={() => {
        onSelect(item);
        onClose();
      }}
    >
      {/* Obrázok */}
      {item.media_type === 'image' && item.url ? (
        <Image
          source={{ uri: item.url }}
          style={styles.cardImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.videoThumbnail}>
          <Text style={styles.videoIcon}>🎬</Text>
        </View>
      )}

      {/* Info pod fotkou */}
      <View style={styles.cardInfo}>
        <Text style={styles.cardDate}>{item.date}</Text>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        {item.copyright && (
          <Text style={styles.cardAuthor} numberOfLines={1}>
            © {item.copyright}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <SafeAreaView style={styles.container}>
        {/* Header s nadpisom v strede a X vpravo */}
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text style={styles.galleryTitle}>Gallery</Text>
          <TouchableOpacity
            style={styles.closeButtonContainer}
            onPress={onClose}
          >
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Grid fotiek */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00d4ff" />
          </View>
        ) : history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No photos in history</Text>
          </View>
        ) : (
          <FlatList
            data={history}
            renderItem={renderGalleryItem}
            keyExtractor={(item, index) => `${item.date}-${index}`}
            numColumns={columns}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.gallery}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151718',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 20 : 20,
    marginTop: Platform.OS === 'android' ? 0 : 0,
  },
  closeButtonContainer: {
    padding: 8,
  },
  closeButton: {
    color: '#00d4ff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  galleryTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  headerSpacer: {
    width: 44,
  },
  gallery: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  galleryCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    aspectRatio: 1,
  },
  videoThumbnail: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#0f3460',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoIcon: {
    fontSize: 24,
  },
  cardInfo: {
    padding: 10,
  },
  cardDate: {
    color: '#00d4ff',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardAuthor: {
    color: '#888',
    fontSize: 9,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
});
