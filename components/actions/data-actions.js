import { db } from "@/firebase/firebase-client";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  query as firestoreQuery,
  where,
  orderBy,
  limit,
  getDoc,
} from "firebase/firestore";
import { errorHandler } from "@/hooks/error";

// ===== CREATE DATA ACTION =====
const createDataAction = async ({ table_name, id, query }) => {
  try {
    // ===== CREATE DATA =====
    const collectionRef = collection(db, table_name);
    let docRef;

    if (id) {
      // Use custom ID if provided
      docRef = doc(db, table_name, id);
      await setDoc(docRef, query.data);
    } else {
      // Generate random ID if no custom ID provided
      docRef = await addDoc(collectionRef, query.data);
    }

    const res = { id: docRef.id, ...query.data };

    // ===== RETURN =====
    return res;
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

// ===== UPDATE DATA ACTION =====
const updateDataAction = async ({ table_name, query }) => {
  try {
    // ===== UPDATE DATA =====
    const { where } = query;
    const docRef = doc(db, table_name, where.id);
    await updateDoc(docRef, query.data);
    const res = { id: where.id, ...query.data };

    // ===== RETURN =====
    return res;
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

// ===== LOAD ALL DATA ACTION =====
const loadAllDataAction = async ({ table_name, query }) => {
  try {
    // ===== LOAD DATA =====
    const collectionRef = collection(db, table_name);
    let q = collectionRef;

    // Handle where conditions
    if (query?.where) {
      const whereConditions = Object.entries(query.where).map(
        ([field, value]) => {
          // Check if the field is an array field that needs array-contains
          if (Array.isArray(value)) {
            return where(field, "array-contains", value[0]);
          }
          return where(field, "==", value);
        }
      );
      q = firestoreQuery(collectionRef, ...whereConditions);
    }

    // Handle orderBy
    if (query?.orderBy) {
      q = firestoreQuery(
        q,
        orderBy(query.orderBy.field, query.orderBy.direction || "asc")
      );
    }

    const snapshot = await getDocs(q);
    const res = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // ===== RETURN =====
    return res;
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

// ===== LOAD SINGLE DATA ACTION =====
const loadSingleDataAction = async ({ table_name, id, query }) => {
  try {
    // If id is provided, fetch the document directly by id
    if (id) {
      const docRef = doc(db, table_name, id);
      const docSnap = await getDoc(docRef);
      const res = docSnap.exists()
        ? { id: docSnap.id, ...docSnap.data() }
        : null;
      return res;
    }

    // Otherwise, fallback to query-based fetch
    const collectionRef = collection(db, table_name);
    let q = collectionRef;

    if (query?.where) {
      const whereConditions = Object.entries(query.where).map(
        ([field, value]) => where(field, "==", value)
      );
      q = firestoreQuery(collectionRef, ...whereConditions, limit(1));
    }

    const snapshot = await getDocs(q);
    const firstDoc = snapshot.docs[0];
    const res = firstDoc ? { id: firstDoc.id, ...firstDoc.data() } : null;

    // ===== RETURN =====
    return res;
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

// ===== FIND UNIQUE DATA ACTION =====
const findUniqueDataAction = async ({ table_name, query }) => {
  try {
    // ===== FIND UNIQUE DATA =====
    const docRef = doc(db, table_name, query.where.id);
    const docSnap = await getDoc(docRef);
    const res = docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;

    // ===== RETURN =====
    return res;
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

// ===== FIND FIRST DATA ACTION =====
const findFirstDataAction = async ({ table_name, query }) => {
  try {
    // ===== FIND FIRST DATA =====
    const collectionRef = collection(db, table_name);
    let q = collectionRef;

    if (query?.where) {
      const whereConditions = Object.entries(query.where).map(
        ([field, value]) => where(field, "==", value)
      );
      q = firestoreQuery(collectionRef, ...whereConditions, limit(1));
    }

    const snapshot = await getDocs(q);
    const doc = snapshot.docs[0];
    const res = doc ? { id: doc.id, ...doc.data() } : null;

    // ===== RETURN =====
    return res;
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

// ===== EXPORTS =====
export {
  createDataAction,
  updateDataAction,
  loadAllDataAction,
  loadSingleDataAction,
  findUniqueDataAction,
  findFirstDataAction,
};
