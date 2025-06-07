# Puppeteer Live Development

This setup provides a Docker-based Puppeteer instance for live development and design iteration.

## Usage

1. Start the containers:
```bash
docker-compose up
```

2. The app will be available at http://localhost:5173

3. Puppeteer commands (type in the puppeteer container logs):
   - `screenshot` - Take a screenshot
   - `reload` - Reload the page
   - `viewport <width> <height>` - Change viewport size
   - `evaluate <code>` - Run JavaScript in the page
   - `exit` - Close the browser

4. Screenshots are saved in the `screenshots/` directory

## Interacting with Puppeteer

To send commands to the Puppeteer instance:
```bash
docker-compose exec puppeteer sh
# Then type commands directly
```

Or attach to the container:
```bash
docker attach night-sky-poetry-puppeteer-1
```