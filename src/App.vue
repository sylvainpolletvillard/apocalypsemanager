<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style lang="postcss">
@import url("styles/icons.pcss");

html,
body {
  margin: 0;
  padding: 0;
}

body {
  text-align: center;
  font-size: 1.5rem;
  background-color: #333;
}

ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
}

a {
  text-decoration: none;
  color: inherit;
}

h1 {
  color: goldenrod;
  background-color: rgba(255, 255, 255, 0.1);
  border-top: 4px solid goldenrod;
  border-bottom: 4px solid goldenrod;
  font-size: 1.3em;
  margin: 0.25em 0;
  padding: 0.25em 0.1em;
}

p {
  padding: 0 0.5em;
}

#app {
  font-family: "Black Ops One", "Impact", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  user-select: none;
  text-align: center;
  color: white;
  background-color: #000;
  background-image: url("assets/spacerock.gif");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 512px;
  height: 100vh;
  min-height: 512px;
  width: calc(100vh * 1080 / 1920);
  min-width: 256px;
  margin: auto;
  position: relative;
}

p,
small {
  font-family: "Oswald", sans-serif;
  margin: 0;
}

.action {
  display: block;
  font-size: 1.4em;
  background-image: url("assets/action.png");
  background-size: 100% 300%;
  text-align: center;
  position: relative;
  margin: 8px;

  .icon {
    position: absolute;
    left: 16px;
    top: 14px;
    width: 32px;
    height: 32px;
    background-size: 32px;
  }

  a {
    display: block;
    padding: 12px;
    cursor: pointer;
  }

  &:not(.disabled):hover {
    background-position-y: -100%;
  }

  &.disabled {
    background-position-y: -200%;
    a {
      cursor: default;
    }
  }
}

.item {
  display: block;
  height: 64px;
  background-image: url("assets/item.png");
  background-size: 100% 100%;
  text-align: left;
}

#nav {
  padding: 0;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;

  ul {
    padding: 0;
    margin: 0;
    white-space: nowrap;
  }
}

#nav li {
  display: inline-block;
}

#nav a {
  color: inherit;
  text-decoration: none;
}

@media (max-height: 960px) {
  body {
    font-size: 1.25rem;
  }
}

@media (max-height: 800px) {
  body {
    font-size: 1rem;
  }
}
</style>
