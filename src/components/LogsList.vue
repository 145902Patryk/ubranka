<template>
  <table class="table">
    <thead>
    <tr>
      <th scope="col">Data</th>
      <th scope="col">Akcja</th>
      <th scope="col">Info</th>
      <th scope="col">Konto</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(el, index) in list" :key="index"
        :class="{'table-success':el.action==='ADD','table-danger':el.action==='DELETE',
            'table-warning':el.action==='UPDATE', }">

      <th scope="row">{{el.date.toDate().toLocaleString('pl')}}</th>
      <td>{{el.action}}</td>
      <td v-if="el.action==='UPDATE'">
        <p v-for="(extra, index) in el.extras" :key="index" style="margin: 0">
          {{extra.name}}<span v-if="extra.size"> ({{sizesArray[extra.size]}})</span>:
          {{extra.count}} <i class="fa-solid fa-arrow-right"></i> {{el.info[extra.id]}}
        </p>
      </td>
      <td v-else>{{el.info.name}}
        <span v-if="el.info.size"> ({{el.info.size}})</span>: {{el.info.count}}
      </td>
      <td>{{el.user}}</td>
    </tr>
    </tbody>
  </table>
</template>

<script>
import {logsList} from "@/firebase_setup";

export default {
  name: "LogsList",
  setup(){
    return{
      list:logsList(),
      sizesArray: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL',]
    }
  }
}
</script>

