import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  Platform
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import MaskedView from "@react-native-masked-view/masked-view";

// import ColorStrip from "./components/ColorStrip";
// import CategoryPill from "./components/CategoryPill";
// import ContentCard from "./components/ContentCard";

const isIOS = Platform.OS === "ios";
const { width, height } = Dimensions.get("window");


function hexToRgba(hex, alpha = 1) {
  const normalized = hex.replace("#", "");
  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

const contentData = [
  {
    type: "Film",
    title: "Interstellar",
    director: "Christopher Nolan",
    description:
      "Film de science-fiction où des astronautes voyagent à travers un trou de ver pour sauver l'humanité.",
    image: require("./assets/interstellar.jpg"),
    backgroundColor: ["#FF6B6B", "#4ECDC4"],
    categoryColor: "#4ECDC4",
    icon: "🎬",
    stripColors: ['#00CFFF', '#FFEB3B', '#9C27B0'],
  },
  {
    type: "Musique",
    title: "See You Again (avec Kali Uchis)",
    album: "Flowers boy",
    artist: "Taylor, The creator",
    description:
      "C'est ce genre de morceau qui te serre un peu la poitrine sans trop savoir pourquoi. Beau, doux, bizarre. Tu veux juste que ça dure plus longtemps.",
    image: require("./assets/seeyouagain.jpg"),
    backgroundColor: ["#FF9F43", "#EE5A24"],
    categoryColor: "#FF9F43",
    icon: "🎵",
    stripColors: ['#FF9F43', '#E91E63', '#FFC107'],
  },
  {
    type: "Podcast",
    title: "Le Floodcast",
    hosts: "podcast animé par Florent Bernard (FloBer) et Adrien Ménielle.",
    description:
      "Un podcast décontracté où les discussions partent dans tous les sens.",
    image: require("./assets/floodcast.jpg"),
    backgroundColor: ["#DBF227", "#9FC131"],
    categoryColor: "#9FC131",
    icon: "🎙️",
    stripColors: ['#6C7B7F', '#8BC34A', '#CDDC39'],
  },
  {
    type: "Série",
    title: "One Piece (Live Action)",
    platform: "Netflix",
    description:
      "Les aventures de Monkey D. Luffy, un jeune pirate élastique rêvant de trouver le légendaire trésor « One Piece » et de devenir roi des pirates.",
    image: require("./assets/one-piece.jpg"),
    backgroundColor: ["#FF6348", "#FF9F43"],
    categoryColor: "#FF6348",
    icon: "📺",
    stripColors: ['#F44336', '#FF9800', '#FFEB3B'],
  },
];

const ColorStrip = ({ colors }) => (
  <View style={styles.colorStripContainer}>
    {colors.map((c, i) => (
      <View key={i} style={[styles.colorBand, { backgroundColor: c }]} />
    ))}
  </View>
);

const CategoryPill = ({ type, color, icon }) => (
  <View style={[styles.categoryPill, { backgroundColor: color }]}>
    <Text style={styles.categoryIcon}>{icon}</Text>
    <Text style={styles.categoryText}>{type}</Text>
  </View>
);

const ContentCard = ({ item }) => (
  <View style={styles.cardContainer}>
    <View style={styles.card}>
    <LinearGradient
        colors={item.backgroundColor}
        style={styles.backgroundGradient}
      />
      <Image source={item.image} style={styles.contentImage} />
      <LinearGradient
        colors={["transparent", hexToRgba(item.backgroundColor[1], 0.85)]}
        style={styles.overlay}
      >
        <MaskedView
          style={styles.blurWrapper}
          maskElement={
            <LinearGradient
              colors={["transparent", "black"]}
              locations={[0.2, 1]}
              style={StyleSheet.absoluteFill}
            />
          }
        >
          <BlurView
            intensity={10}
            tint="default"
            style={StyleSheet.absoluteFill}
          />
        </MaskedView>
        <View style={styles.contentInfo}>
          <Text style={styles.contentTitle}>{item.title}</Text>
          {item.director && (
            <Text style={styles.contentSubtitle}>
              Réalisateur : {item.director}
            </Text>
          )}
          {item.album && (
            <Text style={styles.contentSubtitle}>Album : {item.album}</Text>
          )}
          {item.artist && (
            <Text style={styles.contentSubtitle}>Auteur : {item.artist}</Text>
          )}
          {item.hosts && (
            <Text style={styles.contentSubtitle}>{item.hosts}</Text>
          )}
          {item.platform && (
            <Text style={styles.contentSubtitle}>
              Plateforme : {item.platform}
            </Text>
          )}
          <Text style={styles.contentDescription}>"{item.description}"</Text>
          <Text style={[styles.recommendedBy, { color: 'white' }]}>
            Recommandé par Adrien
          </Text>
          <TouchableOpacity style={styles.discoverButton}>
            <Text style={styles.discoverButtonText}>Découvrir</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  </View>
);

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(height);
  const scrollViewRef = useRef(null);

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / scrollHeight);
    setCurrentIndex(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FBFF29" />
      <ColorStrip colors={contentData[currentIndex].stripColors} />
      <View style={styles.header}>
        <CategoryPill
          type={contentData[currentIndex].type}
          color={contentData[currentIndex].categoryColor}
          icon={contentData[currentIndex].icon}
        />
        <TouchableOpacity >
          <Ionicons name="settings" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      <ScrollView
        ref={scrollViewRef}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onLayout={(e) => {
          setScrollHeight(e.nativeEvent.layout.height);
        }}
        style={styles.scrollView}
      >
        {contentData.map((item, index) => (
          <View key={index} style={[styles.page, { height: scrollHeight }]}>
            <ContentCard item={item} />
          </View>
        ))}
      </ScrollView>

      {/* Share Button */}
      <TouchableOpacity style={styles.shareButton}>
        <Ionicons name="share-outline" size={20} color="#FFF" />
        <Text style={styles.shareButtonText}>Partager</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFF29",
  },
  header: {
    backgroundColor: "#FBFF29",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    position: "absolute",
    top: isIOS ? 50 : 0,
    height: 70,
    left: 0,
    right: 0,
    zIndex: 5,
  },

  colorStripContainer: {
    position: 'absolute', 
    top: isIOS ? 60 : 0,
    right: 100,
    height: '100%',
    width: 80, 
    flexDirection: 'row', 
    zIndex: 15,
  },
  colorBand: { flex: 1 },

  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  categoryText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
    position: 'relative',   
    zIndex: 15,
  },
  page: {
    paddingHorizontal: 10,
    paddingTop: 61,
  },
  cardContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 50,
    borderColor: "#000",
    borderWidth: 2,
    padding: 8,
  },
  card: {
    flex: 1,
    justifyContent: "flex-end",
    borderRadius: 40,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    borderColor: "#000",
    borderWidth: 2,
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  blurWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "80%",
  },
  contentInfo: {
    position: 'absolute',
    bottom: 25,
    left: 25,
    right: 25,
    },
  contentTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
  },
  contentSubtitle: {
    fontSize: 16,
    color: "#FFF",
    marginBottom: 4,
    opacity: 0.9,
  },
  contentDescription: {
    fontSize: 16,
    color: "#FFF",
    lineHeight: 22,
    marginTop: 12,
    marginBottom: 8,
    fontStyle: "italic",
  },
  recommendedBy: {
    fontSize: 14,
    marginBottom: 20,
  },
  discoverButton: {
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  discoverButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 15,
    paddingVertical: 15,
    borderRadius: 25,
    height: 58,
    position: 'relative',
    zIndex: 15,
  },
  shareButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
});
