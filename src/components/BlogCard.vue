<template>
  <div class="medium-container blog-card" :style="cardStyle">
    <g-link class="link" :to="blogPost.path" />
    <div class="info">
      <h3 class="title">
        {{ blogPost.title }}
      </h3>
      <p class="excerpt">
        {{ blogPost.excerpt }}
      </p>
      <BlogMeta :post="blogPost" />
      <div class="tags">
        <TagChip
          class="tagChip"
          v-for="tag in sortedTags"
          :key="tag.id"
          :tag="tag"
          :link-enabled="false"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import BlogMeta from "./BlogMeta.vue";
import TagChip from "./TagChip.vue";
import { BlogPost } from "@/types/BlogPost";
@Component({
  components: { BlogMeta, TagChip },
})
export default class BlogCard extends Vue {
  @Prop() blogPost!: BlogPost;

  get cardStyle(): object {
    if (this.blogPost.tags.map((it) => it.category).includes("cybersec")) {
      return {
        backgroundColor: "#41B883",
        backgroundImage: `url(${require("@/assets/images/flag.svg")})`,
      };
    } else {
      return {
        backgroundColor: "#009a90",
        backgroundImage: `url(${require("@/assets/images/nush_logo_asterisk.svg")})`,
      };
    }
  }
  get backgroundColor(): string {
    // @ts-ignore
    return;
  }
  get backgroundImage(): string {
    // @ts-ignore
    return;
  }
  get sortedTags(): Array<object> {
    return this.blogPost.tags.sort((u: object, v: object) =>
      // @ts-ignore
      v.category.localeCompare(u.category),
    );
  }
}
</script>

<style lang="scss" scoped>
div.blog-card {
  position: relative;
  //background-color: var(--bg-color);
  color: white;
  padding: 0;
  border-radius: 1rem;
  box-shadow: 0 5px 9px 2px rgba(177, 184, 183, 0.93);
  display: flex;
  flex-flow: row;

  background-image: url("../assets/images/nush_logo_asterisk.svg");
  background-repeat: no-repeat;
  background-position: right (-20 + random(40)-20) + px bottom
    (-100 + random(40)-20) + px;

  transition:
    box-shadow 0.3s,
    transform 0.3s;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 5px 23px 4px rgba(177, 184, 183, 0.93);
  }

  .info {
    padding: 3rem 3rem 2rem;
    overflow: hidden;
  }

  .link {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .title {
    margin-top: 0;
    margin-bottom: 1rem;
    color: white;
  }
  .blog-poster {
    border-radius: 20px;
    width: 100%;
    margin-bottom: 2rem;
  }
  .tags {
    margin-top: 1rem;
  }
}
::v-deep a {
  color: white;
}
</style>
