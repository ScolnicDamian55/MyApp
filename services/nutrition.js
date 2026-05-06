import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

// Сохранение блюда
export async function saveMeal(meal, date = new Date()) {
  const uid = auth.currentUser.uid;
  const day = date.toISOString().split('T')[0]; // YYYY-MM-DD
  const ref = doc(db, 'users', uid, 'dailyLogs', day);

  const snap = await getDoc(ref);
  let meals = [];
  if (snap.exists()) {
    meals = snap.data().meals || [];
  }
  meals.push(meal);

  const totals = meals.reduce((acc, m) => ({
    calories: acc.calories + (m.calories || 0),
    protein: acc.protein + (m.protein || 0),
    carbs: acc.carbs + (m.carbs || 0),
    fat: acc.fat + (m.fat || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  await setDoc(ref, { meals, totals }, { merge: true });
}

// Загрузка блюд за день
export async function loadMeals(date = new Date()) {
  const uid = auth.currentUser.uid;
  const day = date.toISOString().split('T')[0];
  const ref = doc(db, 'users', uid, 'dailyLogs', day);

  const snap = await getDoc(ref);
  if (snap.exists()) {
    return snap.data();
  }
  return { meals: [], totals: { calories: 0, protein: 0, carbs: 0, fat: 0 } };
}
