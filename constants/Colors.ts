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

// Enhanced dark mode colors
const darkBackground = "#121212";
const darkSurface = "#1E1E1E";
const darkElevated = "#2C2C2C";
const darkPurple = "#c67dff";
const darkText = "#F0F0F0";
const darkSubtext = "#B0B0B0";

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
    text: darkText,
    background: darkBackground,
    tint: darkPurple,
    icon: darkSubtext,
    tabIconDefault: darkSubtext,
    tabIconSelected: darkPurple,

    // Primary Purple Theme
    primary: darkPurple,
    primaryDark: "#a44dff",
    primaryLight: "#d9a7ff",
    primaryBackground: darkElevated,

    // Secondary Colors
    indigo: "#8da2fb",
    indigoBackground: "#2D3452",
    pink: "#ff9ad5",
    pinkBackground: "#3D2A3A",

    // Neutral Colors
    gray: grayLight,
    grayMedium: "#A0A0A0",
    grayDark: darkSurface,
  },
};
