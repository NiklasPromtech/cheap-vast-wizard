# VAST Creator Hub

A tool that turns a video file into a ready-to-use [VAST](https://en.wikipedia.org/wiki/Video_Ad_Serving_Template) tag — the IAB standard that lets a video play as a programmatic ad — so you can run video creative without paying a platform to host the files.

**Live app:** https://vastcreatorhub.info

## Why I built it

A DSP we were using started charging to host uploaded video files. But uploading a **VAST tag** was free — and a VAST tag is just a small XML wrapper that points to a hosted video and tells the ad player how to serve it.

So instead of paying per hosted file, I built a generator that produces valid VAST tags from your video. Same creative running in market, without the hosting fee. It's a small tool that solved a real, recurring cost.

## What it does

- Takes a video (or a hosted video URL) and generates a spec-compliant VAST tag
- Handles the XML structure the ad player expects — media file, tracking events, duration, click-through
- Gives you a tag you can paste straight into a campaign, no file hosting on the paid platform required

## How it's built

- **Frontend:** TypeScript / React (built with [Lovable](https://lovable.dev))
- Generates IAB-standard VAST XML from user input
- Live at [vastcreatorhub.info](https://vastcreatorhub.info)

## The idea behind it

Fifteen years in programmatic advertising taught me where the hidden costs and manual friction sit. This is one of them turned into a tool: a painful, recurring, billable task (hosting video creative) removed by a small piece of software that produces the free alternative instead. Deep-domain problem, lightweight build.

---

*One of a number of things I've built — mostly AI-powered tools, data systems, and small apps that solve a real problem. Built solo, shipped live.*
