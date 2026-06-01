"use strict";

/**
 * 🧠 STORAGE LAYER CENTRALIZADO
 * Evita JSON errors y datos corruptos
 */

export const Storage = {

  /**
   * 📥 GET seguro
   */
  get(key) {
    try {

      const item = localStorage.getItem(key);

      if (item === null || item === "undefined") {
        return null;
      }

      return JSON.parse(item);

    } catch (error) {
      console.warn(`Storage get error (${key})`, error);
      return null;
    }
  },

  /**
   * 💾 SET seguro
   */
  set(key, value) {
    try {
      localStorage.setItem(
        key,
        JSON.stringify(value)
      );
    } catch (error) {
      console.error(`Storage set error (${key})`, error);
    }
  },

  /**
   * 🗑️ REMOVE
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Storage remove error (${key})`, error);
    }
  },

  /**
   * 🧹 CLEAR específico
   */
  clear() {
    localStorage.clear();
  }

};
