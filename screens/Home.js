import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  SectionList,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import debounce from "lodash.debounce";
import {
  createTable,
  getMenuItems,
  saveMenuItems,
  filterByQueryAndCategories,
} from "./database";
import Filters from "./Filters";
import { getSectionListData, useUpdateEffect } from "./utils";
import { Searchbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import * as Font from "expo-font";

const Home = ({ navigation }) => {
  const [formData, setFormData] = useState({});

  const fetchProfileImage = async () => {
    const savedFormData = await AsyncStorage.getItem("formData");
    setFormData(JSON.parse(savedFormData));
  };

  useEffect(() => {
    fetchProfileImage();
  }, []);

  const [data, setData] = useState([]);
  const sections = ["mains", "starters", "desserts"];
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [searchText, setSearchText] = useState("");

  const filteredMenuItems = menuItems.filter(
    (menuItem) =>
      (selectedCategories.length === 0 ||
        selectedCategories.includes(menuItem.category)) &&
      (searchText === "" ||
        menuItem.name.toLowerCase().includes(searchText.toLowerCase()) ||
        menuItem.description.toLowerCase().includes(searchText.toLowerCase()))
  );
  const Filters = ({ onChange, selections, sections }) => {
    return (
      <View style={styles.menuCategoryContainer}>
        {sections.map((section, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              onChange(index);
              handleCategorySelection(section);
            }}
            style={[
              {
                backgroundColor: selections[index] ? "#F4CE14" : "lightgray",
              },
              styles.menuCategories,
            ]}
          >
            <View>
              <Text
                style={[
                  {
                    color: selections[index] ? "#495E57" : "black",
                    fontWeight: selections[index] ? "900" : "600",
                  },
                  styles.menuCategoriesText,
                ]}
              >
                {section}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const [filterSelections, setFilterSelections] = useState(
    sections.map(() => false)
  );

  const handleSearchTextChange = (text) => {
    setSearchText(text);
  };
  useUpdateEffect(() => {
    (async () => {
      const activeCategories = sections.filter((s, i) => {
        if (filterSelections.every((item) => item === false)) {
          return true;
        }
        return filterSelections[i];
      });
      try {
        const menuItems = await filterByQueryAndCategories(
          query,
          activeCategories
        );
        const sectionListData = getSectionListData(menuItems);
        setData(sectionListData);
      } catch (e) {
        // Alert.alert(e.message);
      }
    })();
  }, [filterSelections, query]);
  const handleCategorySelection = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  const lookup = useCallback((q) => {
    setQuery(q);
  }, []);

  const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

  const handleSearchChange = (text) => {
    setSearchBarText(text);
    debouncedLookup(text);
  };

  const handleFiltersChange = async (index) => {
    const arrayCopy = [...filterSelections];
    arrayCopy[index] = !filterSelections[index];
    setFilterSelections(arrayCopy);
  };

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json"
        );
        const data = await response.json();
        setMenuItems(data.menu);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMenuItems();
  }, []);

  const BASE_URL =
    "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main";

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

  const images = {
    "greekSalad.jpg": require("../assets/greekSalad.jpg"),
    "bruschetta.jpg": require("../assets/bruschetta.jpg"),
    "grilledFish.jpg": require("../assets/grilledFish.jpg"),
    "pasta.jpg": require("../assets/pasta.jpg"),
    "lemonDessert.jpg": require("../assets/lemonDessert.jpg"),
  };

  return (
    <ScrollView style={styles.scrollContainer} stickyHeaderIndices={[2]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require("../assets/Logo.png")} style={styles.logo} />
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile")}
            style={styles.profileImageContainer}
          >
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
          </TouchableOpacity>
        </View>
        <View style={styles.heroMainContainer}>
          <View style={styles.heroContainer}>
            <View style={styles.heroLeftContainer}>
              <Text style={styles.littlelemon}>Little Lemon</Text>
              <Text style={styles.chicago}>Chicago</Text>
              <Text style={styles.heroText}>
                We are a family owned Mediterranean restaurant, focused on
                traditional recipes served with a modern twist.
              </Text>
            </View>
            <View style={styles.heroRightContainer}>
              <Image
                source={require("../assets/header1.jpg")}
                style={styles.headerImage}
              />
            </View>
          </View>
          <Searchbar
            placeholder="Search"
            placeholderTextColor="#333333"
            value={searchText}
            onChangeText={handleSearchTextChange}
            iconColor="#333333"
            inputStyle={{ color: "#333333" }}
            elevation={0}
            style={styles.searchBar}
          />
        </View>

        <Text style={styles.orderForDelivery}>ORDER FOR DELIVERY!</Text>

        <Filters
          selections={filterSelections}
          onChange={handleFiltersChange}
          sections={sections}
        />

        <View style={styles.horizontalBreak}></View>
        {filteredMenuItems.map((menuItem, index) => (
          <View style={styles.menuItemsMainContainer} key={index}>
            <View style={styles.menuItemsContainer}>
              <View style={styles.menuItemsTextContainer}>
                <Text style={styles.name}>{menuItem.name}</Text>
                <Text
                  style={[styles.description, { height: "20%" }]}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {menuItem.description}
                </Text>
                <Text style={styles.price}>${menuItem.price}</Text>
              </View>
              <View style={styles.menuItemsImageContainer}>
                <Image
                  // source={{uri: `${BASE_URL}/images/${menuItem.image}?raw=true`,}}
                  source={images[menuItem.image]}
                  resizeMode="cover"
                  style={styles.menuImage}
                />
              </View>
            </View>
          </View>
        ))}

        <View>
          <SectionList
            sections={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.menuItemsMainContainer}>
                name={item.name}
                price={item.price}
                description={item.description}
                image={item.image}
              </View>
            )}
            renderSectionHeader={({ section: { name } }) => (
              <Text style={styles.sectionHeader}>{name}</Text>
            )}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    marginTop: 25,
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    width: "100%",
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  logo: {
    flex: 1,
    width: "60%",
    height: "100%",
    resizeMode: "contain",
  },
  profileImageContainer: {
    width: "25%",
    height: "100%",
    justifyContent: "center",
  },
  profileImage: {
    width: "60%",
    height: "60%",
    resizeMode: "contain",
    borderRadius: 50,
    alignSelf: "center",
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
  heroMainContainer: {
    backgroundColor: "#495E57",
    height: 270,
  },
  heroContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "#495E57",
    flexDirection: "row",
    height: 190,
    paddingHorizontal: 8,
  },
  heroLeftContainer: {
    width: "60%",
    paddingHorizontal: 10,
  },
  heroRightContainer: {
    flex: 1,
    justifyContent: "center",
  },
  littlelemon: {
    color: "#F4CE14",
    paddingTop: 15,
    fontSize: 41,
    fontFamily: "MarkaziText-Medium",
  },
  chicago: {
    color: "#EDEFEE",
    fontSize: 26,
    marginBottom: 2,
    fontFamily: "MarkaziText-Medium",
  },
  heroText: {
    color: "#EDEFEE",
    fontSize: 18,
    marginBottom: 15,
    fontFamily: "MarkaziText-Regular",
  },
  headerImage: {
    width: "70%",
    height: "70%",
    borderRadius: 8,
    alignSelf: "center",
  },
  searchBar: {
    backgroundColor: "#EDEFEE",
    color: "#495E57",
    marginBottom: 20,
    borderRadius: 16,
    width: "95%",
    marginLeft: "auto",
    marginRight: "auto",
    fontFamily: "MarkaziText-Medium",
  },
  orderForDelivery: {
    fontSize: 22,
    marginVertical: 24,
    paddingLeft: 15,
    fontFamily: "Karla-ExtraBold",
  },
  menuCategoryContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  menuCategories: {
    color: "black",
    paddingVertical: 9,
    width: "25%",
    borderRadius: 11,
    textAlign: "center",
    paddingHorizontal: 9,
  },
  menuCategoriesText: {
    textTransform: "capitalize",
    fontFamily: "Karla-Bold",
    fontSize: 19,
    height: 25,
    textAlign: "center",
  },
  horizontalBreak: {
    height: 2,
    width: "95%",
    borderColor: "lightgray",
    borderWidth: 1,
    margin: "auto",
    marginVertical: 20,
  },
  menuImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
    borderRadius: 6,
  },
  menuItemsContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    height: "20%",
    padding: 20,
  },
  menuItemsMainContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    height: 170,
    borderBottomColor: "lightgray",
    borderBottomWidth: 2,
  },
  menuItemsTextContainer: {
    width: "60%",
    height: 180,
  },
  name: {
    color: "black",
    marginBottom: 10,
    fontSize: 19,
    fontFamily: "Karla-ExtraBold",
  },
  description: {
    height: 20,
    color: "black",
    flexWrap: "wrap",
    textAlign: "left",
    marginBottom: 10,
    fontSize: 15,
    fontFamily: "Karla-Medium",
  },
  price: {
    color: "#495E57",
    fontSize: 18,
    fontFamily: "Karla-Bold",
  },
  menuItemsImageContainer: {
    width: "25%",
    height: "25%",
  },
});

export default Home;
