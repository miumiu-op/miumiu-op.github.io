# miumiu-op.github.io
go somewhere and log everywhere

not sure if the following works

<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>
