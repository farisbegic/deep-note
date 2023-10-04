import constants from "@/config/constants";
import firestore from "@/firebase/config";
import { NextResponse } from "next/server";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";

export async function GET(req) {
  const name = req.nextUrl.searchParams.get("name");
  const id = req.nextUrl.searchParams.get("id");
  const whereConditions = JSON.parse(
    req.nextUrl.searchParams.get("whereConditions")
  );
  const orderByConditions = JSON.parse(
    req.nextUrl.searchParams.get("orderByConditions")
  );

  if (!constants.collections[name]) {
    throw new Error("Invalid collection name");
  }

  let result = null;

  try {
    if (id) {
      // Fetch a single document by ID
      const docRef = doc(firestore, name, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        result = docSnap.data();
      } else {
        return NextResponse.json(
          { message: "No such document!" },
          { status: 404 }
        );
      }
    } else {
      const colRef = collection(firestore, name);
      let q = query(colRef);

      for (const condition of whereConditions) {
        const [field, operator, value] = condition;
        q = query(q, where(field, operator, value));
      }

      for (const condition of orderByConditions) {
        const [field, direction] = condition;
        q = query(q, orderBy(field, direction));
      }

      const querySnapshot = await getDocs(q);
      result = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }
  } catch (e) {
    return NextResponse.error(e);
  }

  return NextResponse.json({ result: result }, { status: 200 });
}
