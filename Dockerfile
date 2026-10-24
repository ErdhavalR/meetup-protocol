FROM node:22-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY index.html tsconfig.json ./
COPY src ./src
RUN npm run build
FROM python:3.12-slim
WORKDIR /app
COPY server/requirements.txt ./server/requirements.txt
RUN pip install --no-cache-dir -r server/requirements.txt
COPY server ./server
COPY --from=frontend /app/dist ./dist
RUN mkdir /app/data
EXPOSE 8080
CMD ["uvicorn","server.app:app","--host","0.0.0.0","--port","8080"]
