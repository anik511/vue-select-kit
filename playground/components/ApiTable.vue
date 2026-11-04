<script setup>
defineProps({
  columns: { type: Array, required: true },
  rows: { type: Array, required: true },
  /** indexes of columns rendered as code */
  codeColumns: { type: Array, default: () => [0] },
})
</script>

<template>
  <div class="api-table">
    <table>
      <thead>
        <tr>
          <th v-for="c in columns" :key="c">{{ c }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row[0]">
          <td v-for="(cell, i) in row" :key="i">
            <code v-if="codeColumns.includes(i)" v-html="cell" />
            <span v-else v-html="cell" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
