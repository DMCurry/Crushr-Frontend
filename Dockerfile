# Use a lightweight Node.js image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json first (better caching)
COPY package*.json ./

# Install dependencies (and force latest esbuild version if needed)
RUN npm install && npm install esbuild@latest --force

# Copy the rest of the application files
COPY . .

# Expose the port Vite uses (change if needed)
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev"]

