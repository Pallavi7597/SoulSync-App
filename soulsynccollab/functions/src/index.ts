// import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions/v1"; // Use v1 for auth triggers

admin.initializeApp();
const db = admin.firestore();

export const createUserDocument = functions.auth
  .user()
  .onCreate(async (user) => {
    try {
      await db
        .collection("users")
        .doc(user.uid)
        .set(JSON.parse(JSON.stringify(user)));
      logger.log(`User document created for UID: ${user.uid}`);
    } catch (error) {
      logger.error(`Error creating user document: ${error}`);
    }
  });
