import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Header from "./Header";
import { AuthContext } from "../AuthContext";
import { useFonts } from "expo-font";
import * as Font from "expo-font";

const Onboarding = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const { onboard } = useContext(AuthContext);

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
  const handleInput = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateName = () => {
    if (formData.firstName.trim().length < 3) {
      setErrorMessage("* Name should contain atleast 3 or more characters");
    }
    if (formData.firstName.trim().length >= 3) {
      setErrorMessage("");
    }
  };

  const validateEmail = () => {
    let re = /\S+@\S+\.\S+/;
    let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    if (re.test(formData.email) || regex.test(formData.email)) {
      setErrorMessage("");
    } else {
      setErrorMessage("Please enter a valid email address");
    }
  };

  const agree = formData.firstName && formData.email;

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.main}>
        <Header />
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <Text style={styles.heading}>Let us get to know you</Text>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              required
              value={formData.firstName}
              onChangeText={(value) => handleInput("firstName", value)}
              onBlur={validateName}
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              required
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(value) => handleInput("email", value)}
              onBlur={validateEmail}
            />
          </View>
          <Text style={styles.errorMsg}>{errorMessage}</Text>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  formData.firstName && formData.email
                    ? "rgb(207, 206, 224)"
                    : "gray",
              },
            ]}
            onPress={() => onboard(formData)}
            disabled={!agree}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "rgb(223,222,227)",
  },
  main: {
    paddingTop: 25,
    backgroundColor: "rgb(223,222,227)",
  },
  container: {
    backgroundColor: "rgb(223,222,227)",
  },
  innerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(207, 206, 224)",
    width: "100%",
  },
  heading: {
    fontSize: 42,
    marginVertical: 100,
    textAlign: "center",
    fontFamily: "MarkaziText-Medium",
  },
  label: {
    fontSize: 24,
    marginBottom: 11,
    fontFamily: "Karla-ExtraBold",
  },
  input: {
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 7,
    width: "70%",
    height: 50,
    marginBottom: 40,
    fontSize: 21,
    fontFamily: "Karla-Bold",
    paddingLeft: 7,
  },
  button: {
    backgroundColor: "rgb(207, 206, 224)",
    borderRadius: 7,
    paddingVertical: 11,
    paddingHorizontal: 32,
    marginTop: 50,
    display: "flex",
    alignSelf: "center",
    width: "50%",
  },
  errorMsg: {
    color: "red",
    fontSize: 16,
    fontFamily: "Karla-Medium",
  },
  buttonText: {
    fontSize: 22,
    textAlign: "center",
    fontFamily: "Karla-ExtraBold",
  },
});

export default Onboarding;
