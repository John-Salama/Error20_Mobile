/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// Primary Purple Theme
const purplePrimary = "#9046cf";
const purpleDark = "#7828c8";
const purpleLight = "#b57edc";
const purpleBg = "#f0e6ff";

// Secondary Colors
const indigoDark = "#4338ca"; // indigo-700
const indigoLight = "#e0e7ff"; // indigo-100
const pinkDark = "#be185d"; // pink-700
const pinkLight = "#fce7f3"; // pink-100

// Neutral Colors
const white = "#ffffff";
const grayLight = "#f3f4f6"; // gray-100
const grayMedium = "#9BA1A6"; // gray-400
const grayDark = "#374151"; // gray-700

export const Colors = {
  light: {
    text: "#11181C",
    background: white,
    tint: purplePrimary,
    icon: grayMedium,
    tabIconDefault: grayMedium,
    tabIconSelected: purplePrimary,

    // Primary Purple Theme
    primary: purplePrimary,
    primaryDark: purpleDark,
    primaryLight: purpleLight,
    primaryBackground: purpleBg,

    // Secondary Colors
    indigo: indigoDark,
    indigoBackground: indigoLight,
    pink: pinkDark,
    pinkBackground: pinkLight,

    // Neutral Colors
    gray: grayDark,
    grayMedium: grayMedium,
    grayLight: grayLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: purpleLight,
    icon: grayMedium,
    tabIconDefault: grayMedium,
    tabIconSelected: purpleLight,

    // Primary Purple Theme
    primary: purpleLight,
    primaryDark: purpleDark,
    primaryLight: purplePrimary,
    primaryBackground: purpleDark,

    // Secondary Colors
    indigo: indigoLight,
    indigoBackground: indigoDark,
    pink: pinkLight,
    pinkBackground: pinkDark,

    // Neutral Colors
    gray: grayLight,
    grayMedium: grayMedium,
    grayDark: grayDark,
  },
};
