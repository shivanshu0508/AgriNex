# AgriNex
MERN based project

## Frontend/backend deployment

The frontend's Vercel deployment must use `VITE_API_URL` set to
`https://agrinex-ov8y.onrender.com/api`.

In the Render backend service, set `CLIENT_URL` to
`https://agri-nex-two.vercel.app` (no trailing slash), then redeploy the backend.
To allow multiple frontend origins, separate them with commas. The backend uses
this value for CORS; it defaults to `http://localhost:5173` when unset.
