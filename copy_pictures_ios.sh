iosProjectResPath='platforms/ios/TV Grafstal/Resources/icons'
iosProjectSplashPath='platforms/ios/TV Grafstal/Resources/splash'
iosIconPath='www/res/icon/ios'
iosSplashPath='www/res/screen/ios'

cp -R ${iosIconPath}/ "${iosProjectResPath}/"

cp ${iosSplashPath}/screen-iphone-portrait.png "${iosProjectSplashPath}/Default~iphone.png"
cp ${iosSplashPath}/screen-iphone-portrait-568h-2x.png "${iosProjectSplashPath}/Default-568h@2x~iphone.png"
cp ${iosSplashPath}/Launch_image_ipad_landscape_2x.png "${iosProjectSplashPath}/Default-Landscape@2x~ipad.png"
cp ${iosSplashPath}/Launch_image_ipad_landscape.png "${iosProjectSplashPath}/Default-Landscape~ipad.png"
cp ${iosSplashPath}/Launch_image_ipad_2x.png "${iosProjectSplashPath}/Default-Portrait@2x~ipad.png"
cp ${iosSplashPath}/Launch_image_ipad.png "${iosProjectSplashPath}/Default-Portrait~ipad.png"
cp ${iosSplashPath}/screen-iphone-portrait-2x.png "${iosProjectSplashPath}/Default@2x~iphone.png"
