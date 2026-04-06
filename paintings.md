---
layout: default
title: Paintings
permalink: /paintings/
fadein: true
---
<style>
.post-title {
  font-family: 'Space Grotesk', sans-serif;
}
</style>
I work on a concept in stages - usually starting with a charcoal/graphite sketch and then moving onto a digital study/painting. The final step is in physical media. Sometimes this process is in reverse or goes back and forth between media.

<div class="filter-bar">
  <div id="myBtnContainer">
<!--    <button class="btn active" onclick="filterSelection('latest', this)">Latest</button> -->
    <button class="btn" onclick="filterSelection('all', this)">All</button>
    <button class="btn" onclick="filterSelection('finished', this)">Finished</button>
    <button class="btn" onclick="filterSelection('studies', this)">Studies</button>
  </div>
</div>

<div id="gallery-grid">
    {% for item in paintings %}
      <div class="column {{ item.category }}{% if item.latest %} latest{% endif %}">
        <div class="text-block">{{ item.title }}</div>
        <a href="{{ item.filename }}">
          <img src="{{ item.filename }}" loading="lazy"/>
        </a>
      </div>
    {% endfor %}
</div>

<link rel="stylesheet" href="/css/filter.css">
<link rel="stylesheet" href="/css/lightbox.css">
<link rel="stylesheet" href="/css/columns.css">
<script src="/js/lightbox.js"></script>
<script src="/js/filter.js"></script>
