# FROM node:22

# WORKDIR /app

# # Install curl for healthchecks
# RUN apt-get update && apt-get install -y curl

# COPY package*.json ./

# RUN npm install

# COPY . .

# EXPOSE 9000

# CMD ["npm", "run", "dev"]




# ---------- Stage 1: Dependencies (full Node) ----------
FROM node:22 AS deps

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --production

# ---------- Stage 2: Runtime (slim Node) ----------
FROM node:22-slim AS runtime

WORKDIR /app

# Install curl for healthchecks
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
# Copy app source code
COPY . .

EXPOSE 9000

CMD ["npm", "run", "dev"]

