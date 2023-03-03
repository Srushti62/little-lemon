import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRef, useEffect } from "react";

export const validateEmail = (email) => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  if (reg.test(email) === false) {
    return false;
  } else {
    return true;
  }
};

export const validatePhone = (phone) => {
  if (phone.length >= 15) {
    return true;
  }
};

export const validateName = (name) => {
  let reg = /^[a-z ,.'-]+$/i;
  if (reg.test(name) === false) {
    return false;
  }
  if (name.length >= 2 && reg.test(name) === true) {
    return true;
  }
};

const saveData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    console.log(`Data saved for key "${key}": ${value}`);

    return true;
  } catch (error) {
    console.log("AsyncStorage Error: " + error.message);
    return false;
  }
};

const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
      console.log(`Retrieved data for key "${key}": ${value}`);
    } else {
      return null;
    }
  } catch (error) {
    console.log("AsyncStorage Error: " + error.message);
    return null;
  }
};

const updateData = async (key, value) => {
  try {
    await AsyncStorage.mergeItem(key, value);
    return true;
  } catch (error) {
    console.log("AsyncStorage Error: " + error.message);
    return false;
  }
};

const getAllData = async () => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const allData = await AsyncStorage.multiGet(allKeys);

    const dataObject = {};

    allData.forEach((data) => {
      const key = data[0];
      const value = data[1];
      dataObject[key] = value;
    });
    console.log("Retrieved all data:", dataObject);

    return dataObject;
  } catch (error) {
    console.log("AsyncStorage Error: " + error.message);
    return null;
  }
};

export function getSectionListData(data) {
  const dataByCategory = data.reduce((acc, curr) => {
    const menuItem = {
      id: curr.id,
      name: curr.title,
      price: curr.price,
    };
    if (!Array.isArray(acc[curr.category])) {
      acc[curr.category] = [menuItem];
    } else {
      acc[curr.category].push(menuItem);
    }
    return acc;
  }, {});
  const sectionListData = Object.entries(dataByCategory).map(([key, item]) => {
    return {
      title: key,
      data: item,
    };
  });
  return sectionListData;
}

export function useUpdateEffect(effect, dependencies = []) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, dependencies);
}

export { saveData, getData, updateData, getAllData };
