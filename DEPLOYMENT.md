# Deployment

The workflow in `.github/workflows/deploy.yml` publishes the Zensical build to
GitHub Pages only when manually dispatched. It intentionally does not run when
`main` is pushed; automatic deployment can be enabled after launch approval.

## One-time GitHub setup

In the repository's **Settings → Pages**, choose **GitHub Actions** as the
deployment source. Confirm the custom domain is `johnnygreco.dev` and enable
HTTPS after the DNS check succeeds.

## Release

```bash
uv run zensical build --clean
git push origin main
```

After launch is approved, open **Actions → Deploy Zensical site**, choose
**Run workflow**, and watch the deployment. Then verify the homepage, a writing
card, the linked article, the theme switcher, and the custom domain. The
`docs/CNAME` file is copied into the published artifact automatically.
