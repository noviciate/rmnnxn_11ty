---
layout: default
title: Photos
permalink: /photos/
fadein: true
---
<style>
.post-title {
  font-family: 'Space Grotesk', sans-serif;
}
</style>
{% include "photoblurb.md" %}

<div class="filter-bar">
  <div id="myBtnContainer">
    <button class="btn active" onclick="filterSelection('latest', this)">Latest</button>
    <button class="btn" onclick="filterSelection('all', this)">All</button>
    <button class="btn" onclick="showMore()">More...</button>
    <div id="more" style="display:none">
      <button class="btn" onclick="filterSelection('flowers', this)">Flowers</button>
      <button class="btn" onclick="filterSelection('water', this)">Water</button>
      <button class="btn" onclick="filterSelection('rural', this)">Rural</button>
      <button class="btn" onclick="filterSelection('village', this)">Village</button>
      <button class="btn" onclick="filterSelection('urban', this)">Urban</button>
      <button class="btn" onclick="filterSelection('trails', this)">Trails</button>
    </div>
  </div>
</div>

<div id="gallery-grid">
    {% for item in photosinterleaved %}
      <div class="column {{ item.category }}{% if item.latest %} latest{% endif %}">
        <div class="text-block">{{ item.title }}</div>
        <a href="{{ item.filename }}">
          <img src="{{ item.filename }}" loading="lazy"/>
        </a>
      </div>
    {% endfor %}
</div>

{% include "gallery-assets.html" %}
