<template>
  <div class="layout">
    <header class="header">
      <g-link class="brand" to="/">
        <img
          class="logo"
          alt="AppVenture Logo"
          src="@/assets/images/appventure_logo_nobg.svg"
        />
        {{ $static.metadata.siteName }}
        <span class="tiny-text">by NUS High</span>
      </g-link>

      <i class="nav-button las la-bars" @click="toggleNav()" />
      <nav class="nav" ref="nav" @click="toggleNav()">
        <g-link class="nav__link" to="/about"> About </g-link>
        <g-link class="nav__link" to="/projects"> Projects </g-link>
        <g-link class="nav__link" to="/cybersec"> Cybersec </g-link>
        <g-link class="nav__link" to="/community"> Community </g-link>
        <g-link class="nav__link" to="/blog"> Blog </g-link>
        <g-link class="nav__link" to="/contact"> Contact </g-link>
      </nav>
    </header>

    <transition name="fade" appear>
      <main class="main">
        <slot />
      </main>
    </transition>

    <footer>
      <div class="medium-container">
        <div class="column">
          <a href="https://www.nushigh.edu.sg">
            <img
              src="@/assets/images/nush_logo_color.svg"
              alt="school-logo"
              title="Visit school website"
              width="126"
            />
          </a>
          <ul class="links">
            <li class="link">
              <a
                href="//maps.google.com/?q=20+Clementi+Ave+1,+Singapore+129957"
                title="Open address in Google Maps"
                ><address>20 Clementi Ave 1, Singapore 129957</address></a
              >
            </li>
          </ul>
          <div class="link-icons">
            <a href="https://nush.app/rss.xml">
              <img src="@/assets/rss.png" alt="rss" width="20" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class DefaultLayout extends Vue {
  toggleNav() {
    let w = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0,
    );
    if (w <= 700) {
      const nav = this.$refs.nav as HTMLElement;
      nav.classList.toggle("visible");
    }
  }
}
</script>

<static-query>
  query {
    metadata {
      siteName
    }
  }
</static-query>

<style lang="scss" scoped>
.layout {
  max-width: 760px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;

  display: flex;
  flex-flow: column nowrap;
  min-height: 100vh;
  align-items: center;

  main {
    padding-bottom: 2rem;
  }
}

.header {
  background-color: #fff;
  position: sticky;
  top: -16px;
  z-index: 9001;
  margin-top: -16px;

  border: 2px solid $primary-color;
  border-radius: 16px;
  box-shadow: 0 5px 9px 2px rgba(0, 0, 0, 0.2);
  width: calc(100% + 36px);

  padding: 8px 16px 0 16px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  height: 80px;

  .brand {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    font-weight: bold;

    &.active,
    &:hover {
      text-decoration: none;
    }
    margin-left: 0;

    .logo {
      height: 1.6rem;
      margin: auto 0;
      padding-right: 0.2rem;
    }

    .tiny-text {
      padding-top: 0.4rem;
      padding-left: 0.2rem;
      font-size: 0.6rem;
    }
  }

  .nav-button {
    display: none;
  }
}

@media (max-width: 720px) {
  .header {
    nav {
      display: none;
    }

    nav.visible {
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;

      display: flex;
      flex-flow: column nowrap;
      align-items: stretch;
      justify-content: center;
      padding: 32px;

      background: rgba(0, 0, 0, 0.9);

      .nav__link {
        color: #fff;
        text-align: center;
        border: 2px solid #fff;
        margin: 8px 0;
      }

      &::after {
        color: #fff;
        content: "Click anywhere to dismiss";
        text-align: center;
        margin: 16px 0;
      }
    }

    .nav-button {
      color: $primary-color;
      display: block;
      font-size: 1.6rem;
    }
  }
}

.nav__link {
  font-weight: bold;
  color: #2c3e50;

  vertical-align: baseline;
  padding: 0.2rem 0.6rem;
  margin: 0 4px;
  text-decoration: none;
  border-radius: 0.4rem;

  &.active {
    text-decoration: none;
    color: $primary-color;
  }

  &:hover {
    text-decoration: none;
    background-color: #eee;
  }
}

.fade-enter-active {
  transition: opacity 0.5s;
}

.fade-enter {
  opacity: 0;
}

.main {
  width: 100%;
}

footer {
  margin-top: auto;
  padding: 1rem;

  border-top: 1px solid #e6e6e6;

  .column {
    padding: 1rem;
    align-items: center;
  }

  ul {
    display: flex;
    flex-flow: row wrap;

    list-style: none;
    margin: 0;
    padding: 0;

    li {
      margin-right: 1.2rem;
    }
  }

  .link a,
  .link address {
    font-size: 0.9rem;
    color: inherit;
    text-decoration: none;
    text-align: center;

    &:hover {
      color: #777;
    }
  }
}

.link-icons {
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>
