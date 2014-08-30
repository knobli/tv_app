androidPorjectResPath='platforms/android/res'
androidIconPath='www/res/icon/android'
androidSplashPath='www/res/screen/android'

cp ${androidIconPath}/App_Icon_96.png ${androidPorjectResPath}/drawable/icon.png
cp ${androidIconPath}/App_Icon_72.png ${androidPorjectResPath}/drawable-hdpi/icon.png
cp ${androidIconPath}/App_Icon_36.png ${androidPorjectResPath}/drawable-ldpi/icon.png
cp ${androidIconPath}/App_Icon_48.png ${androidPorjectResPath}/drawable-mdpi/icon.png
cp ${androidIconPath}/App_Icon_96.png ${androidPorjectResPath}/drawable-xhdpi/icon.png

cp ${androidSplashPath}/splash_hdpi_landscape.png ${androidPorjectResPath}/drawable-land-hdpi/screen.png
cp ${androidSplashPath}/splash_ldpi_landscape.png ${androidPorjectResPath}/drawable-land-ldpi/screen.png
cp ${androidSplashPath}/splash_mdpi_landscape.png ${androidPorjectResPath}/drawable-land-mdpi/screen.png
cp ${androidSplashPath}/splash_xhdpi_landscape.png ${androidPorjectResPath}/drawable-land-xhdpi/screen.png

cp ${androidSplashPath}/splash_hdpi.png ${androidPorjectResPath}/drawable-port-hdpi/screen.png
cp ${androidSplashPath}/splash_ldpi.png ${androidPorjectResPath}/drawable-port-ldpi/screen.png
cp ${androidSplashPath}/splash_mdpi.png ${androidPorjectResPath}/drawable-port-mdpi/screen.png
cp ${androidSplashPath}/splash_xhdpi.png ${androidPorjectResPath}/drawable-port-xhdpi/screen.png
