#!/bin/bash
# Database initialization script for Gene Curator
# Runs SQL files in order to set up the complete database

set -e

# Wait for PostgreSQL to be ready
until pg_isready -h postgres -p 5432 -U gene_curator; do
  echo "Waiting for PostgreSQL to be ready..."
  sleep 2
done

echo "PostgreSQL is ready. Initializing database..."

# Set database connection parameters
export PGHOST=postgres
export PGPORT=5432
export PGUSER=gene_curator
export PGDATABASE=gene_curator

echo "Running database initialization scripts..."

# Run SQL scripts in order
echo "1. Creating initial schema..."
psql -f /docker-entrypoint-initdb.d/001_initial_schema.sql

echo "2. Setting up ClinGen triggers and functions..."
psql -f /docker-entrypoint-initdb.d/002_clingen_triggers.sql

echo "3. Inserting seed data..."
psql -f /docker-entrypoint-initdb.d/003_seed_data.sql

echo "Database initialization complete!"

# Test the setup
echo "Testing ClinGen scoring system..."
psql -c "
SELECT 
    g.approved_symbol,
    c.genetic_evidence_score,
    c.experimental_evidence_score,
    c.total_score,
    c.verdict
FROM curations c
JOIN genes g ON c.gene_id = g.id
WHERE c.mondo_id = 'MONDO:0009691';
"

echo "Database setup and testing complete!"