# Poker Chips Helper

A mobile application to assist a poker host with determining the denominations and distributions of poker chips.

This applications uses the React Native + Expo framework and by extension is primarily implemented in typescript. These frameworks were chosen for their solid reputation, and ability to easily compile to both major platforms (iOS + Android) with a single code base. Typescript is the default language for new projects with these frameworks, but is also preferred over the javascript alternative as strong typings are very helpful to the developer experience.

## Team Members

- David Westgate
- Lakshmi Vyshnavi Vutukuri
- Mantasha Noyela

## Building, Running, and Developer Resources

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

### Setting Up Environment Variables

To set up your environment variables:

1. Copy the example environment variable file to create your own `.env` file:

```bash
cp .env.example .env
```

2. Open the `.env` file and add your OpenAI API key:

`EXPO_PUBLIC_API_KEY=put-open-ai-key-here`

3. Save the .env file.

This setup allows you to run the application with your own API credentials, and you can switch models if needed.

### VSCode plugins

- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

### Android APK build

To create an APK build, use the following

```bash
npx expo prebuild
cd android
./gradlew assembleRelease # linux
gradlew.bat assembleRelease # possible windows command
```

Then, see `android/app/build/outputs/apk/release/app-release.apk` for the output

### Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
