### Overview

This is a repo for the MOBEOS toolkit, a mobile app toolkit for the EOS Blockchain

### Documentation

[MOBEOS An Open Source Mobile App Toolkit for EOS](https://medium.com/@takafuly/mobeos-an-open-source-mobile-app-toolkit-for-eos-f84166dcadfc)

## Prerequisites

- node.js: v10.9.0
- npm: v6.4.0
- ionic: v4.1.0
- cordova: v8.0.0

## Install and Run

- Clone the product and browse to project root folder
- If you don't have ionic installed, then run:
```
npm install -g ionic
```
- If you don't have cordova installed, then run:
```
npm install -g cordova
```
- Installing node_module dependencies under project root folder, run the following command:
```
npm install
```
- Finally, once all dependencies and components are installed, you can run the application in your local machine using:
```
ionic serve
```

## Generate Android APK file

- first make sure you have a working Android development environment
- Add the android platform to the ionic project by running
```
ionic cordova platform add android
```
- Then generate the apk file by running:
```
ionic cordova andorid build
```
- If successful, the apk file can be found under the project directory in ../platforms/android/build/outputs/apk

## Built With

* [Ionic](https://ionicframework.com/docs/) - Cross-platform apps framework.
* [Angular](https://maven.apache.org/) - Front-end web application platform

## Contributing

Please read [CONTRIBUTING.md](https://github.com/Takafuly/mobeos/blob/master/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details
