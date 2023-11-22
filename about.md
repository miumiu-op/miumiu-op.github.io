---
layout: default
title: About
---

Tryin to see what this file does/
Feel free to explore some of my writing samples:

**Note**: Although these documents have been updated since my departure, approximately 80% of the content remains as my original work as of now.

<ul>
    {% for post in site.posts %}
      <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
      </li>
    {% endfor %}
  </ul>