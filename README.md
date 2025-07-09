# README #

This README would normally document whatever steps are necessary to get your application up and running.

### What is this repository for? ###

* Quick summary
* Version
* [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)

### How do I get set up? ###

* Summary of set up
* Configuration
* Dependencies
* Database configuration
* How to run tests
* Deployment instructions

### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines

### Who do I talk to? ###

* Repo owner or admin
* Other community or team contact

## Image Optimization

To ensure fast image loading and a smooth user experience, follow these best practices:

- **Compress Images:** Use tools like TinyPNG, ImageOptim, or Squoosh to reduce image file sizes before uploading.
- **Use a CDN:** Host images on a fast Content Delivery Network (CDN) to reduce latency for users in different regions.
- **Keep Images Small:** Avoid using unnecessarily large images. Resize images to the maximum display size needed in the UI.
- **Use Next.js Image Component:** Always use the Next.js `<Image />` component for automatic optimization, lazy loading, and responsive images.
- **Preload Critical Images:** For images that must appear instantly (e.g., exam questions), consider preloading them as implemented in the exam components.