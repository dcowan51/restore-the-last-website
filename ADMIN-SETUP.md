# Admin Editor Setup

The site has a visual editor at **`/admin`** for adding and editing projects — no JSON, no code, drag-and-drop photos.

It needs a **one-time login setup** that only you can do, because it involves a secret I must not handle.

---

## What you get

Go to `https://restorethelast.org/admin`, sign in with GitHub, and you get a form for every project: title, type, status, who it serves, funding goal, cover photo, and all the copy. Save, and about a minute later the live site has it.

Adding a project is a button. Deleting one is a button. Reordering is a number.

---

## ⚠️ Saving publishes immediately

Every save commits to `main`, which triggers a deploy. **There is no draft state.** Write it the way you want it read.

If you'd rather saves went through a review step (each edit becomes a pull request you approve), tell me and I'll switch it on — it's one line in `public/admin/config.yml`.

---

## One-time setup (~10 minutes)

### 1. Create a GitHub OAuth App

Go to **https://github.com/settings/developers** → *OAuth Apps* → **New OAuth App**

| Field | Value |
|---|---|
| Application name | `Restore the Last CMS` |
| Homepage URL | `https://restorethelast.org` |
| Authorization callback URL | `https://api.netlify.com/auth/done` |

The callback URL must be **exactly** that — it's Netlify's endpoint, not ours.

Click **Register application**. Copy the **Client ID**, then **Generate a new client secret** and copy that too. The secret is shown once.

### 2. Give them to Netlify

In Netlify: **restore-the-last** → *Site configuration* → **Access & security** → *OAuth* → **Install provider**

Choose **GitHub**, paste the Client ID and Client Secret, save.

### 3. Log in

Go to **https://restorethelast.org/admin** and click *Login with GitHub*. Authorize once, and you're in.

Anyone with write access to the repo can log in. To let a board member edit without touching code, add them as a collaborator on the GitHub repo with **Write** access.

---

## Photos

Upload straight from the editor — they land in `public/uploads/`.

Two things the editor won't warn you about:

- **Convert HEIC first.** iPhone photos are often `.HEIC`, and **no browser can display them.** They'll upload fine and show nothing. In Photos: *File → Export → Export Photo → JPEG*.
- **Resize before uploading.** A phone photo is often 4000px+ and several MB. Everything on the site displays at 1600px or less, so anything bigger is pure load time — and most donors are on phones. Aim for ~1600px wide.

---

## If something breaks

The build validates every project against a schema (`src/content/config.ts`). If a field is wrong, the deploy **fails loudly and the live site keeps working** — it doesn't publish something broken.

You'd see something like:

```
projects → phoenix-group-home frontmatter does not match collection schema.
status: Invalid enum value. Expected 'open' | 'active' | 'in-production' | 'funded', received 'seeking-funding'
```

That names the project, the field, and what it expected. Fix it in `/admin` and save again.

To see failures without hunting: Netlify → **Deploys**. A red one is a rejected save.

---

## Where things live

| Thing | Path |
|---|---|
| Editor UI | `/admin` → `public/admin/index.html` |
| What fields the editor shows | `public/admin/config.yml` |
| What the build enforces | `src/content/config.ts` |
| The projects themselves | `src/content/projects/*.json` (one file per project) |
| Uploaded photos | `public/uploads/` |

**If you add a field, it has to go in both `config.yml` and `config.ts`** — otherwise the editor offers something the build then rejects.
