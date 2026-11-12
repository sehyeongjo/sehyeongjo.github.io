<template>
  <div class="publications">
    <h2>Publication</h2>
    <ul>
      <li
        class="publication"
        v-for="publication in publications.slice().reverse()"
        :key="publication.title"
      >
        <img
          v-if="publication.thumbnail"
          class="thumbnail"
          :src="publication.thumbnail"
          :alt="publication.title"
          loading="lazy"
        />
        <div class="info">
          <strong>
            {{ publication.title }}
          </strong>
          <br />
          <vue-markdown
            class="is-size-7"
            :source="emphasizeMe(publication.authors)"
          ></vue-markdown>
          <span
            class="is-size-7"
          >
            <em>{{ publication.booktitle }} ({{ publication.shortBooktitle }})</em>
          </span>
          <br />
          <vue-markdown
            class="is-size-7"
            :source="publication.links"
          ></vue-markdown>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown';
export default {
  name: 'publications',
  props: [
    'contents',
    'publications',
  ],
  components: {
    VueMarkdown,
  },
  data() {
    return {};
  },
  methods: {
    emphasizeMe(text) {
      return text.replace(this.contents.name, `**${this.contents.name}**`);
    }
  },
}
</script>

<style lang="scss" scoped>
  .publications ul {
    list-style: none;
    margin-left: 0;
  }

  .publication {
    display: flex;
    align-items: flex-start;
    margin-bottom: 1.25rem;
  }

  .thumbnail {
    flex-shrink: 0;
    width: 30%;
    max-width: 180px;
    margin-right: 1rem;
    border-radius: 4px;
  }

  .info {
    min-width: 0;
  }
</style>
