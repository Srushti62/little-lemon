import React from "react";
import { StyleSheet, View, Image } from "react-native";

const Header = () => {
  return (
    <View style={styles.container}>
      <Image source={require("../assets/Logo.png")} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    alignItems: "stretch",
    padding: 20,
    backgroundColor: "white",
    width: "100%",
    marginTop: 15,
  },
  logo: {
    backgroundColor: "white",
    marginTop: 15,
    height: 80,
    width: "100%",
    resizeMode: "contain",
    display: "flex",
    alignItems: "stretch",
  },
});

export default Header;
