import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import * as Font from "expo-font";

const Filters = ({ onChange, selections, sections }) => {
  const loadFonts = async () => {
    await Font.loadAsync({
      "MarkaziText-Regular": require("../assets/fonts/MarkaziText-Regular.ttf"),
      "MarkaziText-Medium": require("../assets/fonts/MarkaziText-Medium.ttf"),
      "Karla-Regular": require("../assets/fonts/Karla-Regular.ttf"),
      "Karla-Medium": require("../assets/fonts/Karla-Medium.ttf"),
      "Karla-Bold": require("../assets/fonts/Karla-Bold.ttf"),
      "Karla-ExtraBold": require("../assets/fonts/Karla-ExtraBold.ttf"),
    });
  };
  useEffect(() => {
    loadFonts();
  }, []);

  const [loaded] = useFonts({
    "MarkaziText-Regular": require("../assets/fonts/MarkaziText-Regular.ttf"),
    "MarkaziText-Medium": require("../assets/fonts/MarkaziText-Medium.ttf"),
    "Karla-Regular": require("../assets/fonts/Karla-Regular.ttf"),
    "Karla-Medium": require("../assets/fonts/Karla-Medium.ttf"),
    "Karla-Bold": require("../assets/fonts/Karla-Bold.ttf"),
    "Karla-ExtraBold": require("../assets/fonts/Karla-ExtraBold.ttf"),
  });

  if (!loaded) {
    return null; // or show a loading indicator
  }

  return (
    <View style={styles.filtersContainer}>
      {sections.map((section, index) => (
        <TouchableOpacity
          key={section}
          onPress={() => {
            onChange(index);
          }}
          style={{
            flex: 1 / sections.length,
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
            height: "5%",
            backgroundColor: selections[index] ? "#495e57" : "#edefee",
            borderRadius: 9,
            marginRight: 15,
          }}
        >
          <View>
            <Text
              style={{
                fontFamily: "Karla-ExtraBold",
                color: selections[index] ? "#edefee" : "#495e57",
              }}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    // backgroundColor: "#fff",
    // flexDirection: "row",
    // textTransform: "capitalize",
    // alignItems: "center",
    // marginBottom: 16,
    // paddingLeft: 15,
  },
});

export default Filters;
