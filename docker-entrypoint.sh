#!/bin/sh
set -e

# Run migrations if MIGRATE_ON_STARTUP is set
if [ "$MIGRATE_ON_STARTUP" = "true" ]; then
  echo "Running database migrations..."
  node ./node_modules/prisma/build/index.js db push --skip-generate
  echo "Migrations complete."
fi

# Start the app
exec node server.js
