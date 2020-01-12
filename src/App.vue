<template>
  <div id="bg" class="w-100 h-100 d-flex justify-content-center align-items-center">
    <div id="content" class="p-4">
      <div class="d-flex justify-content-center">
        <img id="img-portrait" class="mb-2 img-fluid" src="./assets/shane.jpg" alt="portrait">
      </div>
      <h4 class="m-0 mt-2 text-center" style="font-weight: normal">Shane Griffin</h4>
      <div class="text-center text-muted p-0 mb-3" style="font-size: 14px; margin-top: -3px;">
        Software Engineer
      </div>
      <div class="d-flex justify-content-center mt-1">
        <ul id="links" class="p-0 m-0">
          <li>
            <a target="_blank" href="https://github.com/shanegri/">
              <span href="#" class="fa fa-github"></span>Github
            </a>
          </li>
          <li>
            <a target="_blank" href="https://www.linkedin.com/in/shanegri/">
              <span href="#" class="fa fa-linkedin"></span>Linkedin
            </a>
          </li>
          <li>
            <a target="_blank" href="mailto: shanegri@buffalo.edu">
              <span href="#" class="fa fa-envelope"></span>Email
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {

  }
}
</script>

<style>
body, html{
  margin: 0;
  padding: 0;
  height: 100%;
}
#bg {
  background: rgb(10,15,15);
}
#content {
  background: rgb(255,254,252);
}
#img-portrait {
  border-radius: 100%;
  max-width: 100px;
}
#links {
  list-style-type: none;
}
#links span {
  margin-right: 10px;
}
#links li {
  margin-bottom: 8px;
}
#links a, h4 {
  color: rgb(10,15,15);
}
</style>
