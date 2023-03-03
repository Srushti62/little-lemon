import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";
import { MaskedTextInput } from "react-native-mask-text";
import Checkbox from "expo-checkbox";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../AuthContext";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import * as Font from "expo-font";

const Profile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    orderStatusesCheck: false,
    passwordChangesCheck: false,
    specialOffersCheck: false,
    newsletterCheck: false,
    image: null,
  });
  const [layout, setLayout] = useState(null);

  const handleLayout = (event) => {
    const { layout } = event.nativeEvent;
    setLayout(layout);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData((prev) => ({
        ...prev,
        ["image"]: result.assets[0].uri,
      }));
    }
  };

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

  const navigation = useNavigation();

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      ["image"]: null,
    }));
  };

  const saveProfileData = async () => {
    await AsyncStorage.setItem("formData", JSON.stringify(formData));
    Alert.alert("Changes successful.");
  };

  const handleFormData = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { update } = useContext(AuthContext);
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      try {
        const savedFormData = await AsyncStorage.getItem("formData");
        setFormData(JSON.parse(savedFormData));
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const onLayoutView = useCallback((event) => {
    const { height } = event.nativeEvent.layout;
  }, []);

  return (
    <ScrollView>
      <View style={styles.container} onLayout={onLayoutView}>
        {/* <Header /> */}
        <View style={styles.header}>
          <AntDesign
            name="arrowleft"
            size={27}
            color="black"
            style={styles.leftArrow}
            onPress={() => navigation.navigate("Home")}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            style={styles.logoContainer}
          >
            <Image source={require("../assets/Logo.png")} style={styles.logo} />
          </TouchableOpacity>

          {formData.image ? (
            formData.image && (
              <Image
                source={{ uri: formData.image }}
                style={{ width: 60, height: 60, borderRadius: 50 }}
              />
            )
          ) : (
            <Text style={styles.userInitials}>
              {formData.firstName
                ? formData.firstName.charAt(0).toUpperCase()
                : ""}
              {formData.lastName
                ? formData.lastName.charAt(0).toUpperCase()
                : ""}
            </Text>
          )}
        </View>

        <View style={styles.innerContainer}>
          <Text style={styles.personalInfo}>Personal Information</Text>
          <Text style={styles.Avatar}>Avatar</Text>

          <View style={styles.buttonTop}>
            <View>
              {formData.image ? (
                formData.image && (
                  <Image
                    source={{ uri: formData.image }}
                    style={{ width: 60, height: 60, borderRadius: 50 }}
                  />
                )
              ) : (
                <Text style={styles.userInitials}>
                  {formData.firstName
                    ? formData.firstName.charAt(0).toUpperCase()
                    : ""}
                  {formData.lastName
                    ? formData.lastName.charAt(0).toUpperCase()
                    : ""}
                </Text>
              )}
            </View>

            <TouchableOpacity style={styles.buttonChange}>
              <Text style={styles.buttonChangeText} onPress={pickImage}>
                Change
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonRemove}>
              <Text style={styles.buttonRemoveText} onPress={removeImage}>
                Remove
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.labels}>First Name</Text>
          <TextInput
            style={styles.textInputStyle}
            value={formData.firstName}
          ></TextInput>
          <Text style={styles.labels}>Last Name</Text>
          <TextInput
            style={styles.textInputStyle}
            value={formData.lastName}
            onChangeText={(value) => handleFormData("lastName", value)}
          ></TextInput>
          <Text style={styles.labels}>Email</Text>
          <TextInput
            style={styles.textInputStyle}
            value={formData.email}
          ></TextInput>
          <Text style={styles.labels}>Phone Number</Text>
          <MaskedTextInput
            keyboardType="number-pad"
            mask="999-999-9999"
            value={formData.phoneNumber}
            onChangeText={(value) => {
              handleFormData("phoneNumber", value);
            }}
            maxLength={12}
            style={styles.textInputStyle}
          ></MaskedTextInput>

          <Text style={styles.labels}>Email Notifications</Text>

          <View style={styles.checkboxView}>
            <Checkbox
              value={formData.orderStatusesCheck}
              onValueChange={(value) =>
                handleFormData("orderStatusesCheck", value)
              }
              color={formData.orderStatusesCheck ? "#495E57" : "gray"}
              style={styles.checkbox}
            />
            <Text style={styles.checkboxText}>Order Statuses</Text>
          </View>

          <View style={styles.checkboxView}>
            <Checkbox
              value={formData.passwordChangesCheck}
              onValueChange={(value) =>
                handleFormData("passwordChangesCheck", value)
              }
              color={formData.passwordChangesCheck ? "#495E57" : "gray"}
              style={styles.checkbox}
            />
            <Text style={styles.checkboxText}>Password Changes</Text>
          </View>

          <View style={styles.checkboxView}>
            <Checkbox
              value={formData.specialOffersCheck}
              onValueChange={(value) =>
                handleFormData("specialOffersCheck", value)
              }
              color={formData.specialOffersCheck ? "#495E57" : "gray"}
              style={styles.checkbox}
            />
            <Text style={styles.checkboxText}>Special Offers</Text>
          </View>

          <View style={styles.checkboxView}>
            <Checkbox
              value={formData.newsletterCheck}
              onValueChange={(value) =>
                handleFormData("newsletterCheck", value)
              }
              color={formData.newsletterCheck ? "#495E57" : "gray"}
              style={styles.checkbox}
            />
            <Text style={styles.checkboxText}>Newsletter</Text>
          </View>

          <View style={styles.buttonBottom}>
            <TouchableOpacity style={styles.buttonDiscard}>
              <Text
                style={styles.buttonDiscardText}
                onPress={() => navigation.navigate("Home")}
              >
                Discard changes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonSave}
              onPress={() => update(formData)}
            >
              <Text style={styles.buttonSaveText}>Save changes</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.logoutContainer}>
            <TouchableOpacity
              style={styles.buttonLogout}
              onPress={() => logout(formData)}
            >
              <Text style={styles.buttonLogoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
  },
  header: {
    flexDirection: "row",
    width: "100%",
    height: 90,
    margin: "auto",
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  leftArrow: {
    backgroundColor: "#495E57",
    borderRadius: 50,
    height: "60%",
    width: "12%",
    textAlign: "center",
    alignSelf: "center",
    paddingTop: 7,
    color: "#F4CE14",
  },
  logoContainer: {
    flex: 1,
    width: "63%",
    height: "100%",
  },
  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  profileImageContainer: {
    width: "25%",
    height: "100%",
    justifyContent: "center",
  },
  profileImage: {
    width: "20%",
    height: "60%",
    resizeMode: "contain",
    borderRadius: 50,
    alignSelf: "center",
  },
  innerContainer: {
    marginHorizontal: 10,
  },
  personalInfo: {
    fontSize: 32,
    fontFamily: "MarkaziText-Medium",
  },
  Avatar: {
    fontSize: 22,
    fontFamily: "MarkaziText-Regular",
  },
  userInitials: {
    width: 60,
    height: 60,
    borderRadius: 50,
    textAlign: "center",
    alignSelf: "center",
    backgroundColor: "#495E57",
    color: "#F4CE14",
    fontSize: 24,
    lineHeight: 56,
    fontFamily: "Karla-Bold",
  },
  buttonChange: {
    width: "35%",
    borderWidth: 1,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#495E57",
    padding: 11,
  },
  buttonRemove: {
    width: "35%",
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "#495E57",
    justifyContent: "center",
    alignItems: "center",
    padding: 11,
  },
  buttonDiscard: {
    width: "45%",
    borderWidth: 1,
    height: 40,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#495E57",
  },
  buttonSave: {
    width: "45%",
    borderWidth: 1,
    height: 40,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#495E57",
  },
  logoutContainer: {
    width: "100%",
    height: "10%",
    marginBottom: 50,
  },
  buttonLogout: {
    flex: 1,
    backgroundColor: "#F4CE14",
    width: "85%",
    borderRadius: 7,
    margin: "auto",
    marginVertical: 15,
    justifyContent: "center",
    alignSelf: "center",
  },
  buttonChangeText: {
    fontSize: 18,
    color: "#F4CE14",
    fontFamily: "Karla-Bold",
  },
  buttonRemoveText: {
    fontSize: 18,
    color: "#495E57",
    fontFamily: "Karla-Bold",
  },
  buttonLogoutText: {
    textAlign: "center",
    color: "#495E57",
    fontSize: 21,
    fontFamily: "Karla-Bold",
  },
  buttonDiscardText: {
    fontSize: 18,
    fontFamily: "Karla-Bold",
  },
  buttonSaveText: {
    fontSize: 18,
    color: "#F4CE14",
    fontFamily: "Karla-Bold",
  },
  buttonTop: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    rowGap: 15,
    paddingHorizontal: 15,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonBottom: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 10,
  },
  checkbox: {
    fontSize: 20,
    width: 20,
    height: 20,
  },
  checkboxView: {
    width: "90%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 11,
  },
  checkboxText: {
    fontSize: 18,
    paddingLeft: 15,
    fontFamily: "Karla-Medium",
  },
  textInputStyle: {
    borderWidth: 1,
    width: "100%",
    fontSize: 20,
    marginBottom: 18,
    borderRadius: 8,
    paddingVertical: 2,
    paddingLeft: 7,
    fontFamily: "Karla-Medium",
  },
  labels: {
    fontSize: 20,
    color: "gray",
    marginBottom: 6,
    fontFamily: "Karla-Bold",
  },
});

export default Profile;
