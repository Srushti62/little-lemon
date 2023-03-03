import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";

const SplashScreen = () => {
  //   const navigation = useNavigation();
  //   setTimeout(() => {
  //       // navigation.replace("Onboarding");
  //   }, 2000);

  return (
    <View style={styles.container}>
      <Image source={require("../assets/SplashScreenLogo.png")} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  logo: {
    width: "35%",
    height: "60%",
    resizeMode: "contain",
  },
});

export default SplashScreen;
