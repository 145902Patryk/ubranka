<template>
  <div id="app" class="container" v-if="logged">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="javascript:void(0);"></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" aria-current="page" href="javascript:void(0);"
                 v-on:click="view=0" :class="{ 'active':view===0}">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="javascript:void(0);" v-on:click="view=1"
                 :class="{ 'active':view===1}">Logs</a>
            </li>
          </ul>
          <div class="d-flex" style="text-align: right">
            <button class="btn btn-outline-danger" style="width: 100px" v-on:click="logOut">Logout</button>
          </div>
<!--          <form class="d-flex">-->
<!--            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">-->
<!--            <button class="btn btn-outline-success" type="submit">Search</button>-->
<!--          </form>-->
        </div>
      </div>
    </nav>
    <div :class="{ 'd-none':view!==0}">
      <ClothesList/>
    </div>
    <div :class="{ 'd-none':view!==1}">
      <LogsList/>

    </div>
  </div>
  <div v-else class="container m-5">
    <div class="form-group">
      <form onsubmit="event.preventDefault();">
        <label>Email</label>
        <input v-model="formData.e" class="form-control" required type="email" />
        <label>Password</label>
        <input v-model="formData.p" class="form-control" required type="password" />

        <button v-on:click="signIn(formData.e, formData.p)" class="btn btn-primary" type="submit"
                style="margin: 5px">Login</button>
      </form>

    </div>
  </div>
</template>

<script>
import ClothesList from "@/components/ClothesList";
import LogsList from "@/components/LogsList";
import {useAuth} from "@/firebase_setup";
import {ref} from "vue";

export default {
  name: 'App',
  components: {
    ClothesList,
    LogsList
  },
  setup(){
    const logOut = () => {
      useAuth().signOut()
    }

    const formData = ref({e:'', p:''})
    const view = ref(0)
    return {
      view,
      logOut,
      formData,
      signIn:useAuth().signIn,
      logged: useAuth().isLogin,
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.active{
  font-weight: bold;
}
</style>
