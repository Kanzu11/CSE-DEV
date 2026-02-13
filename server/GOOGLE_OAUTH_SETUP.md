# Google OAuth Configuration

To complete the setup, you need to configure the "Authorized JavaScript origins" and "Authorized redirect URIs" in your Google Cloud Console project.

## 1. Authorized JavaScript origins
Add the following URIs to allow requests from both your frontend and backend:

- `http://localhost:5173`
- `http://localhost:5000`

## 2. Authorized redirect URIs
Add the following URI for the OAuth callback:

- `http://localhost:5000/api/auth/google/callback`

## 3. Environment Variables
Once you have saved these settings, copy the **Client ID** and **Client Secret** into your `server/.env` file:

```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
```

After updating `.env`, the server will restart automatically.
