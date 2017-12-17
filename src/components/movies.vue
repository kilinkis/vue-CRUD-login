<template>
  <div class="container">
    <div class="page-header">
      <h1>Vue Movies</h1>
    </div>
 
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3>Add Movie</h3>
      </div>
 
      <div class="panel-body">

        <div v-if="!movie.edit">
          <form id="form" class="form-inline" v-on:submit.prevent="addMovie">
            <div class="form-group">
              <label for="movieTitle">Title:</label>
              <input type="text" id="movieTitle" class="form-control" v-model="newMovie.title">
            </div>
            <div class="form-group">
              <label for="movieDirector">Director:</label>
              <input type="text" id="movieDirector" class="form-control" v-model="newMovie.director">
            </div>
            <div class="form-group">
              <label for="movieUrl">URL:</label>
              <input type="text" id="movieUrl" class="form-control" v-model="newMovie.url">
            </div>
            <input type="submit" class="btn btn-primary" value="Add Movie">
          </form>
        </div>

        <div v-else>
          <form id="form" class="form-inline" v-on:submit.prevent="saveEdit(movie)">
            <div class="form-group">
              <label for="movieTitle">Title:</label>
              <input type="text" id="movieTitle" class="form-control" v-model="movie.title">
            </div>
            <div class="form-group">
              <label for="movieDirector">Director:</label>
              <input type="text" id="movieDirector" class="form-control" v-model="movie.director">
            </div>
            <div class="form-group">
              <label for="movieUrl">URL:</label>
              <input type="text" id="movieUrl" class="form-control" v-model="movie.url">
            </div>
            <input type="submit" class="btn btn-primary" value="Save">
            <button v-on:click="cancelEdit(movie)">Cancel</button>
          </form>
        </div>

      </div>

    </div>
 
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3>Movies List</h3>
      </div>
      <div class="panel-body">
        <table class="table table-stripped">
          <thead>
            <tr>
              <th>Title</th>
              <th>director</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="movie in movies">

              <td>
                <a v-bind:href="movie.url" v-bind:key="movie['.key']" target="_blank">{{movie.title}}</a>
              </td>
              <td>
                {{movie.director}}
              </td>
              <td>
                <button v-on:click="editMovie(movie)">Edit</button>
              </td>
              <td>
                <button v-on:click="removeMovie(movie['.key'])">Remove</button>
              </td>

            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <button v-on:click="logout">Logout</button>
  </div>
</template>

<script>

import firebase from 'firebase';
import { moviesRef } from '../firebase'

export default {
  name: 'app',
  firebase: {
    movies: moviesRef
  },
  data () {
    return {
      isEditing: false,
      newMovie: {
        title: '',
        director: '',
        url: 'http://',
        edit: false
      },
      movie: {
        edit: false
      }
    }
  },
  methods: {
    addMovie: function() {
      moviesRef.push( this.newMovie )
      this.newMovie.title = '',
      this.newMovie.director = '',
      this.newMovie.url = 'http://'
      this.newMovie.edit = false
    },
    editMovie: function (movie){
      moviesRef.child(movie['.key']).update({ edit:true });
      this.movie = movie;
      this.movie.edit = true;
      //this.movie = Vue.util.extend({}, movie); // deep clone to prevent modify the original object
    },
    removeMovie: function (key) {
      moviesRef.child(key).remove()
    },
    cancelEdit(movie){
      //moviesRef.child(key).update({ edit:false })
      this.movie.edit = false;
    },
    saveEdit(movie){
      const key = movie['.key'];
      moviesRef.child(key).set({
        title    : movie.title,
        director : movie.director,
        url      : movie.url,
        edit     : false
      });
      this.movie.edit = false;
    },
    logout(){
      firebase.auth().signOut().then(() => {
        this.$router.replace('login')
      })
    }
  }
}

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
