---
layout: default
title: Writing
permalink: /writing/
---

<style>
  .writing-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .writing-item {
    margin-bottom: 2.5rem;
  }
  .writing-item a {
    text-decoration: none;
    color: inherit;
    display: block;
  }
  .writing-item a:hover .writing-title {
    text-decoration: underline;
  }
  .writing-thumb {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
  }
  .writing-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.1rem;
    margin: 0.5rem 0 0.25rem;
  }
  .writing-date {
    font-size: 0.8rem;
    color: #666;
  }
</style>
<ul class="writing-list">
  {%- for post in collections.writing reversed -%}
  <li class="writing-item">
    <a href="{{ post.url }}">
      {%- if post.data.image -%}
        <img class="writing-thumb" src="{{ post.data.image }}" alt="{{ post.data.title }}"/>
      {%- endif -%}
      <p class="writing-title">{{ post.data.title }}</p>
      <p class="writing-date">{{ post.date | date: "%b %d, %Y" }}</p>
    </a>
  </li>
  {%- endfor -%}
</ul>
