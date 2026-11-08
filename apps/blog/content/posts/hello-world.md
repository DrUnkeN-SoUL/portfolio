---
title: "Hello, world"
description: "Why I am starting a writing section, and what to expect from it."
date: 2026-11-09
tags:
  - meta
  - writing
draft: false
---

# Hello, world

This is the first post on the writing section of my site. I spend most of my
time building backends, data pipelines and infrastructure, and this is where I
will write down the parts that are worth keeping.

## Why write at all

Most engineering knowledge disappears into pull requests and chat threads. A
short post is a better place for the parts that will still be useful in six
months:

- a design decision and the trade-off behind it
- a debugging story with a reproducible fix
- notes on a tool that behaved differently from its documentation
- the occasional project write-up

## What this site is built with

The blog is a static TanStack Start app. Posts are Markdown files with YAML
front matter, which means both of these work:

1. editing in the browser through Pages CMS
2. editing the same files with any local editor or coding agent

Code blocks are highlighted at build time. For example:

```ts
type Post = {
  slug: string;
  title: string;
  date: string;
};

export function isPublished(post: Post) {
  return post.date <= new Date().toISOString().slice(0, 10);
}
```

> The format should stay small enough that writing a post feels cheaper than
> not writing one.

That is the plan. More soon.
