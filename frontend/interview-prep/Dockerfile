# #pull the base image which gives all the tools and lobraries
# FROM node:22

# #make the working directory where the application code will be stored
# WORKDIR /app


# # Copies package.json and package-lock.json (if present) from your host machine (project folder) into the container’s /app directory.
# # The * is a wildcard → it matches both package.json and package-lock.json.
# # This is done before copying all source code to optimize caching (so npm install won’t re-run unless dependencies change).
# COPY package*.json ./

# #compile the code which will install the libraries 
# RUN npm install

# #copy the source code from host machine to you container or into the working directory 
# COPY . .


# # Declares that the app will listen on port 5173 inside the container.
# # This does not actually publish the port — it’s just documentation for Docker (and for humans).
# # When you run the container, you’d map it to your machine like:
# # docker run -p 5173:5173 my-app
# # This binds container’s port 5173 to your localhost’s 5173.
# EXPOSE 5173


# #to run the application 
# CMD ["npm", "run", "dev"]



# ---------- Stage 1: Build ----------
FROM node:22-slim AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ---------- Stage 2: Runtime ----------
FROM node:22-slim AS runtime

WORKDIR /app

COPY package*.json ./

RUN npm install --production

# Copy only built dist files
COPY --from=builder /app/dist ./dist

EXPOSE 5173

CMD ["npm", "run", "preview"]
