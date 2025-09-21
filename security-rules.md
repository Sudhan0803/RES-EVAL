## Firebase Storage Rules for Skill Scan

These rules allow public access for uploading and reading resumes.

**WARNING**: These rules are insecure for a production application as they allow anyone to upload files to your storage bucket. They are suitable only for this demo context where there is no user authentication.

```
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Allow anyone to read and write files in the 'resumes' folder.
    match /resumes/{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

### How to Deploy

1.  Go to your Firebase project console.
2.  Navigate to **Storage**.
3.  Click on the **Rules** tab.
4.  Copy and paste the rules above into the editor.
5.  Click **Publish**.
