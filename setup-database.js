const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function runSQLFile(filePath, description) {
  try {
    console.log(`\n📝 Running: ${description}...`);
    const sqlContent = fs.readFileSync(filePath, 'utf8');
    
    // Split by semicolon and filter out empty statements
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        await sql(statement);
      }
    }
    
    console.log(`✅ ${description} completed successfully`);
  } catch (error) {
    console.error(`❌ Error running ${description}:`, error.message);
    throw error;
  }
}

async function setupDatabase() {
  console.log('🚀 Starting database setup...\n');
  
  try {
    // Step 1: Create schema
    await runSQLFile(
      path.join(__dirname, 'database', 'schema.sql'),
      'Creating database schema'
    );
    
    // Step 2: Run beta testing migration
    await runSQLFile(
      path.join(__dirname, 'database', 'migrations', 'beta_testing_feature.sql'),
      'Adding beta testing features'
    );
    
    // Step 3: Fix role constraint
    await runSQLFile(
      path.join(__dirname, 'database', 'migrations', 'fix_role_constraint.sql'),
      'Fixing role constraints'
    );
    
    // Step 4: Seed initial data
    await runSQLFile(
      path.join(__dirname, 'database', 'seed.sql'),
      'Seeding initial data'
    );
    
    // Step 5: Seed beta programs
    await runSQLFile(
      path.join(__dirname, 'database', 'seed_beta_programs.sql'),
      'Seeding beta programs'
    );
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📊 Verifying data...');
    
    // Verify the setup
    const users = await sql`SELECT COUNT(*) as count FROM users`;
    const products = await sql`SELECT COUNT(*) as count FROM products`;
    const betaPrograms = await sql`SELECT COUNT(*) as count FROM beta_programs`;
    
    console.log(`✅ Users: ${users[0].count}`);
    console.log(`✅ Products: ${products[0].count}`);
    console.log(`✅ Beta Programs: ${betaPrograms[0].count}`);
    
    console.log('\n🚀 You can now start your app with: npm run dev');
    
  } catch (error) {
    console.error('\n❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();

