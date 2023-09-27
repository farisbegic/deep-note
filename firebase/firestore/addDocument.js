"use server";

import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import firestore from "../config";
import { revalidatePath } from "next/cache";
import routes from "@/config/routes";

const addDocument = async (name, data, id = null) => {
  const docRef = id ? doc(firestore, name, id) : collection(firestore, name);

  let result = null;
  let error = null;

  if (id === null) {
    data.createdAt = new Date().toISOString();
  }

  try {
    result = id
      ? await setDoc(docRef, data, { merge: true })
      : await addDoc(docRef, data);

    revalidatePath(routes.home.path);
  } catch (e) {
    console.log(e);
    error = e;
  }

  return { result, error };
};

export default addDocument;
