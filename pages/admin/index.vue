<script setup lang="ts">
const password = ref('')
const vertexType = ref<'Song' | 'Artist' | 'Channel'>('Song')
const vertexProperties = ref('')
watchEffect(() => {
  switch (vertexType.value) {
    case 'Song':
      vertexProperties.value = JSON.stringify({ id: 0, title: '', melonId: '' }, null, 2)
      break;
    case 'Artist':
      vertexProperties.value = JSON.stringify({ id: 0, name: '', melonId: '', isSolo: true, isAI: true }, null, 2)
      break;
    case 'Channel':
      vertexProperties.value = JSON.stringify({ id: 0, youtubeId: '', name: '' }, null, 2)
      break;

    default:
      break;
  }
})

async function insertVertex() {
  try {
    const vertexId = await $fetch('/api/admin/vertex', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Password': password.value
      },
      body: {
        label: vertexType.value,
        id: JSON.parse(vertexProperties.value).id,
        properties: JSON.parse(vertexProperties.value),
      }
    })

    alert(`Vertex inserted: ${vertexId}`)
  } catch (error) {
    alert(error)
  }
}
</script>

<template>
  <div>
    <h1>Admin Page</h1>


    <form>
      <fieldset>
        <legend>Password</legend>

        <label>
          Password: <input type="password" v-model="password" />
        </label>
      </fieldset>

      <fieldset>
        <legend>Vertex</legend>

        <label>
          Type:
          <select v-model="vertexType">
            <option value="Song">Song</option>
            <option value="Artist">Artist</option>
            <option value="Channel">Channel</option>
          </select>
        </label>

        <label>
          Properties:
          <MonacoEditor class="properties-editor" lang="json" v-model="vertexProperties" />
        </label>

        <button type="button" @click="insertVertex">
          Insert
        </button>

      </fieldset>
    </form>

    <div>
    </div>
  </div>
</template>

<style scoped>
fieldset {
  margin: 1em 0;
  padding: 1em;
  border: 1px solid #ccc;
}

fieldset label {
  display: block;
  font-weight: bolder;
  border: 1px solid #ccc;

  * {
    font-weight: initial;
  }

  .properties-editor {
    height: 14em;
  }
}
</style>