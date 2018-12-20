import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

const prodConfig = {
  apiKey: FB_API_KEY,
  projectId: FB_PROJECT_ID,
  databaseURL: FB_DATABASE_URL,
  authDomain: FB_AUTH_DOMAIN,
  storageBucket: FB_STORAGE_BUCKET
};

const devConfig = Object.assign({}, prodConfig);

const config = process.env.NODE_ENV === "production" ? prodConfig : devConfig;

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const database = firebase.database();
const auth = firebase.auth();

export { firebase, database, auth };
