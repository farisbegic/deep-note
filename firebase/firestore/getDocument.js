"use server";

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import firestore from "../config";

const getDocument = async (
  collectionName,
  id,
  whereConditions = [],
  orderByConditions = []
) => {
  let result = null;
  let error = null;

  try {
    if (id) {
      // Fetch a single document by ID
      const docRef = doc(firestore, collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        result = docSnap.data();
      } else {
        error = "No such document!";
      }
    } else {
      // Fetch multiple documents based on where and orderBy conditions
      const colRef = collection(firestore, collectionName);
      let q = query(colRef);

      // Apply where conditions
      for (const condition of whereConditions) {
        const [field, operator, value] = condition;
        q = query(q, where(field, operator, value));
      }

      // Apply orderBy conditions
      for (const condition of orderByConditions) {
        const [field, direction] = condition;
        q = query(q, orderBy(field, direction));
      }

      const querySnapshot = await getDocs(q);
      result = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }
  } catch (e) {
    error = e;
  }

  return { result, error };
};

export default getDocument;
