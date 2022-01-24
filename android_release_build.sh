#phonegap build android
#rm -r platforms/android/assets/www/res 
#platforms/android/cordova/build --release


cordova build --release android
jarsigner.exe -keystore ~/.ssh/tv-app-key.keystore -sigalg SHA1withRSA -digestalg SHA1 platforms/android/build/outputs/apk/android-release-unsigned.apk tv_app
/c/Users/inacta/AppData/Local/Android/Sdk/build-tools/31.0.0/zipalign.exe -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk platforms/android/build/outputs/apk/tv-grafstal.apk