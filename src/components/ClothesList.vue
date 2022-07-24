<template>
  <div class="row">
    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel"
         aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"
                    aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="onSubmit" onsubmit="return false;">
              <div class="form-group">
                <label>Ubranie</label>
                <input v-model="formClothes.name" class="form-control"
                       required v-on:keyup="helper()" v-on:focusout="hideHelper"/>
                <ul class="list-group" style="position: absolute">
                  <li class="list-group-item help-item" v-for="el in filtered" :key="el"
                      v-on:click="setName(el)"
                  >{{el}}</li>
                </ul>
              </div>
              <div class="form-group mt-3">
                <label>Rozmiar</label>
                <select v-model="formClothes.size" class="form-select">
                  <option value="">----</option>
                  <option value="0">XS</option>
                  <option value="1">S</option>
                  <option value="2">M</option>
                  <option value="3">L</option>
                  <option value="4">XL</option>
                  <option value="5">XXL</option>
                  <option value="6">XXXL</option>
                </select>
              </div>
              <div class="form-group mt-3">
                <label>Ilość</label>
                <input v-model="formClothes.count" class="form-control" type="number" min="0" required/>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal"
                    v-on:click="onSubmit">Save
            </button>
          </div>
        </div>
      </div>
    </div>
    <div id="snackbar" aria-live="polite" aria-atomic="true" class="d-flex w-100">
      <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <strong class="me-auto text-green">Zapisano</strong>
          <small></small>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    </div>
    <div class="col-12">
      <div class="buttons">
        <button class="btn btn-secondary" v-on:click="registerLog" :disabled="isDisabled">Update</button>
        <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal">
          Add
        </button>
      </div>
      <table class="table table-bordered">
        <thead>
        <tr>
          <th scope="col">Nazwa</th>
          <th scope="col">Rozmiar</th>
          <th scope="col">Ilość</th>
          <th scope="col">Nowa ilość</th>
          <th scope="col">Akcje</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(el, index) in clothes" :key="index" :class="{'row-bold': !el.id}">
          <td colspan="1" v-if="el.id">{{ el.name }}</td>
          <td colspan="1" v-if="el.id">{{ sizesArray[parseInt(el.size)] }}</td>
          <td colspan="2" v-if="!el.id">{{ el.name }}</td>
          <td colspan="1">{{ el.count }}</td>
          <td colspan="1" v-if="el.id">
            <input style="width: 100px;height: 30px; display: initial" type="number"
                   class="form-control text-center" name="quantity" v-model="quantityNew[el.id]" >
            <span class="quantity" v-if="quantityNew[el.id]"
                  :class="{ 'text-red': parseInt(quantityNew[el.id]) < 0,
                   'text-green': parseInt(quantityNew[el.id]) > 0}">
              <b>{{ tempValue(parseInt(quantityNew[el.id])+ parseInt(el.count), el.id) }}</b>
            </span>
          </td>
          <td colspan="1" v-else></td>
          <td colspan="1">
            <i class="fa-solid fa-trash-can delete-icon" v-on:click="deleteFun(el.id)" v-if="el.id"
            title="Delete"></i>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
import {
  createClothes,
  deleteClothes,
  updateClothes,
  useAuth,
  useLoadClothes
} from "@/firebase_setup";
import {ref} from "vue";

export default {
  name: "ClothesList",
  setup() {
    const clothes = useLoadClothes()
    const quantityNew = ref({})
    const isDisabled = ref(false)
    function toast() {
      let x = document.getElementById("snackbar");
      x.className = "d-flex w-100 show";
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 4000);
    }

    async function registerLog() {
      if(Object.keys(JSON.parse(JSON.stringify(updateDict.value))).length){
        let keys = Object.keys(updateDict.value)
        let logData=[]
        clothes.value.forEach((val)=>{
          if(keys.includes(val.id)){
            logData.push(JSON.stringify(val))
          }
        })
        isDisabled.value = true
        updateClothes(updateDict.value, logData, user.value.email)
        toast()
        quantityNew.value = {}
        updateDict.value = {}
        isDisabled.value = false
      }
    }
    const filtered =  ref([])
    const formClothes = ref({name: '', count: 0, size: ''})
    const updateDict =  ref({})
    function helper() {
      if(formClothes.value.name){
        let elems = clothes.value.map(val=>{
          return val.name
        })
        elems = [...new Set(elems)];
        filtered.value = elems.filter(val=>{
          return val.includes(formClothes.value.name)
        })
        console.log(elems)
      }else{
        filtered.value=[]
      }
    }

    function setName(n) {
      console.log('set', n)
      formClothes.value.name=n
      filtered.value=[]
    }
    async function onSubmit() {
      createClothes({...formClothes.value}, user.value.email)
      formClothes.value = {name: '', count: 0, size: ''}
    }

    async function deleteFun(id) {
      await deleteClothes(id, user.value.email)
    }
    const tempValue = (val, id) => {
      updateDict.value[id]=val
      console.log(JSON.parse(JSON.stringify(updateDict.value)))
      return val
    }
    function hideHelper() {
      setTimeout(()=>{
        filtered.value=[]
      }, 200)
    }
    const { user } = useAuth()
    return {
      clothes,
      onSubmit,
      user,
      quantityNew,
      formClothes,
      registerLog,
      isDisabled,
      helper,
      hideHelper,
      deleteFun,
      filtered,
      setName,
      tempValue,
      sizesArray: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL',]
    }
  }
}
</script>
<style>
.quantity {
  position: absolute;
  margin-left: 50px;
  margin-right: -60px;
}

.text-red {
  color: red;
}

.text-green {
  color: #42b883;
}
#snackbar{
  position: absolute;
  left: 0;
  top: 2%;
}
#snackbar.show .toast {
  display: block;
}
#snackbar.show {
  display: block;
  visibility: visible;
  -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}
.buttons button{
  margin: 2px;
}
.help-item:hover{
  background-color: mintcream;
  cursor: pointer;
  width: 100%;
}
.delete-icon:hover{
  cursor: pointer;
  color: red;
}
.row-bold td{
  font-weight: bold;
}
</style>
