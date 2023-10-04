import constants from "@/config/constants";
import firestore from "@/firebase/config";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req) {
  const path = req.nextUrl.searchParams.get("path") || "/";
  let { data, name, id = null } = await req.json();

  if (!constants.collections[name]) {
    throw new Error("Invalid collection name");
  }

  const docRef = id ? doc(firestore, name, id) : collection(firestore, name);

  let result = null;

  if (id === null) {
    data.createdAt = new Date().toISOString();
  }

  try {
    result = id
      ? await setDoc(docRef, data, { merge: true })
      : await addDoc(docRef, data);

    revalidatePath(path);
  } catch (e) {
    return NextResponse.error(e);
  }

  return NextResponse.json({ result: result }, { status: 200 });
}
