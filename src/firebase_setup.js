// Import the functions you need from the SDKs you need

import { ref, onUnmounted, computed  } from 'vue'
import firebase from "firebase/compat/app";
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import {config} from "../firebase_config";


const firebaseApp = firebase.initializeApp(config)
const auth = firebase.auth()


export function useAuth() {
  const user = ref(null)
  const unsubscribe = auth.onAuthStateChanged(_user => (user.value = _user))

  onUnmounted(unsubscribe)
  const isLogin = computed(() => user.value !== null)

  const signIn = async (email, password) => {
    await auth.signInWithEmailAndPassword(email, password).catch(()=> console.log('Wrong'))
  }
  const signOut = () => auth.signOut()
  // if(auth.currentUser) console.log('>>>',JSON.parse(JSON.stringify(auth.currentUser)).lastLoginAt)
  return { user, isLogin, signIn, signOut }
}

const db = firebaseApp.firestore();
const clothesCollection = db.collection('ubranka');
const logsCollection = db.collection('logs');

export const createLog = (action, data, email, extras=[]) => {
  return logsCollection.add({user:email,date:new Date(), action:action, info:JSON.stringify(data), extras:extras})
}

export const createClothes = (clothes, user) => {
  clothes.size = parseInt(clothes.size)
  clothes.count = parseInt(clothes.count)
  return [clothesCollection.add(clothes), createLog('ADD', clothes, user)]
}

export const deleteClothes = async (id, user) => {
  let data = await clothesCollection.doc(id).get()
  return [await clothesCollection.doc(id).delete(), await createLog('DELETE', data.data(), user)]
}

export const updateClothes = (items, logData, user) => {
  let batch = db.batch();
  for (const [key, value] of Object.entries(items)) {
    batch.update(clothesCollection.doc(key), { count: parseInt(value) });
  }
  if(batch._delegate._mutations.length){
    return [batch.commit(), createLog('UPDATE', items, user, logData)];
  }
  return null

}

export const logsList = () => {
  const logs = ref([])

  const logSnap = logsCollection.orderBy('date', 'desc').limit(100).onSnapshot(snapshot => {
    console.log('onSnapshot log')
    let data=[]
    snapshot.docs.map(doc => {
      data.push({...doc.data()})
    })

    logs.value = data.map(log => {
      log.info = JSON.parse(log.info)
      if(log.extras) {
        log.extras = log.extras.map(val => {
          return JSON.parse(val)
        })
      }
      return log
    })
  })
  onUnmounted(logSnap)
  return logs
}

export const useLoadClothes = () => {
  const clothes = ref([])

  const close = clothesCollection.orderBy('name').orderBy('size').onSnapshot(snapshot => {
    console.log('onSnapshot')
    let lastValue=''
    let data=[]
    let summed=0
    snapshot.docs.map(doc => {
      if(lastValue && lastValue!==doc.data().name){
        data.push({name:'Razem', count:summed})
        summed=0
      }
      summed+=parseInt(doc.data().count)
      lastValue=doc.data().name
      data.push({id: doc.id, ...doc.data()})
    })
    data.push({name:'Razem', count:summed})
    clothes.value = data
  })
  onUnmounted(close)
  return clothes
}