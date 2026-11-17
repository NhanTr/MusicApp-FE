# Combined local workspace

Check out MusicApp-FE and MusicApp-BE- as sibling folders named `frontend_MussicApp` and `backend_MusicApp`. From the frontend directory, run `docker compose -f workspace/docker-compose.yml up --build`. This companion Compose file preserves the original full-stack configuration with paths adapted to this location. Configure the backend private environment first; see `../docs/03-setup-and-configuration.md`. The optional db-import tool drops the public schema and must only be used deliberately on disposable data.
