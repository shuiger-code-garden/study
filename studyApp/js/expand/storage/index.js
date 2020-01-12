import AsyncStorage from '@react-native-community/async-storage';
export default class Storage {
  static async get(key) {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.log(`getItem${key} Error`);
    }
  }

  static async set(key, value) {
    try {
      return await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log(`setItem${key}-${value} Error`);
    }
  }

  static async remove(key) {
    try {
      return await AsyncStorage.removeItem(key);
    } catch (error) {
      console.log(`removeItem${key} Error`);
    }
  }

  static async merge(key, value) {
    try {
      return await AsyncStorage.mergeItem(key, value);
    } catch (error) {
      console.log(`mergeItem${key} Error`);
    }
  }

  static async clear() {
    try {
      return await AsyncStorage.clear();
    } catch (error) {
      console.log('clear Error');
    }
  }

  static async getAllKeys() {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.log('clear Error');
    }
  }
}
