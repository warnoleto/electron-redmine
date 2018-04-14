<template>
    <v-container>
      <v-card>
        <v-btn color="primary" small fab absolute top right dark @click.native.stop="dialog = true"> <v-icon>add</v-icon> </v-btn>
      </v-card>
      <v-dialog v-model="dialog" max-width="500px">
          <v-form ref="form" lazy-validation>
            <v-card>
              <v-card-title>
              <span class="headline">Workspace</span>
              </v-card-title>
              <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12>
                      <v-text-field label="Pasta a monitorar" ref="txtPath" v-model="editedItem.path" required :rules="rules" readonly 
                      prepend-icon="folder" append-icon="search" @click="selectDirectory" lazy-validation></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                      <v-text-field label="Pattern" v-model="editedItem.pattern" required :rules="rules" prepend-icon="filter_list" lazy-validation></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
              </v-card-text>
              <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="warning" flat @click.native="closeDialog">Cancelar</v-btn>
              <v-btn color="primary" flat @click.native="confirmDialog">Confirmar</v-btn>
              </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
        
      <v-flex xs12 sm12 mx-auto>
      <v-data-table :headers="headers" :items="workspaces" class="elevation-1" :rows-per-page-items="[2]">
          <template slot="items" slot-scope="props">
              <td class="text-xs-left">{{ props.item.path }}</td>
              <td class="text-xs-left">{{ props.item.pattern }}</td>
              <td class="justify-center layout px-0">
                  <v-btn icon class="mx-0" @click="editItem(props.item)">
                  <v-icon color="teal">edit</v-icon>
                  </v-btn>
                  <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                  <v-icon color="pink">delete</v-icon>
                  </v-btn>
              </td>
          </template>
      </v-data-table>
      </v-flex>
  </v-container>
</template>

<script>

import util from '@/globals/ui-util'
import electron from 'electron'
const {dialog} = electron.remote

export default {
  name: 'workspaces',
  data () {
    return {
      dialog: false,
      editedIndex: -1,
      editedItem: {},
      workspaces: [],
      headers: [
        { text: 'Diretório', sortable: false, align: 'left' },
        { text: 'Pattern', sortable: false, align: 'left' },
        { text: 'Ações', value: 'name', sortable: false, align: 'right' }
      ],
      rules: [util.required]
    }
  },
  methods: {
    editItem (item) {
      this.editedIndex = this.workspaces.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem (item) {
      const index = this.workspaces.indexOf(item)
      confirm('Está certo disso?') && this.workspaces.splice(index, 1)
    },
    closeDialog () {
      this.dialog = false
      this.editedIndex = -1
      this.editedItem = {}
      this.$refs.form.reset()
    },
    confirmDialog () {
      if (this.$refs.form.validate()) {
        if (this.editedIndex > -1) {
          Object.assign(this.workspaces[this.editedIndex], this.editedItem)
        } else {
          this.workspaces.push(Object.assign({}, this.editedItem))
        }
        this.closeDialog()
      }
    },
    selectDirectory () {
      const properties = ['openDirectory']
      const defaultPath = this.editedItem.path
      let path = dialog.showOpenDialog({properties, defaultPath})
      if (path) {
        this.$refs.txtPath.$emit('input', path[0])
      }
    }
  }
}
</script>

