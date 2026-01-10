const pool = require('./config/database');

async function checkColumns() {
    try {
        const [rows] = await pool.execute('DESCRIBE plantel');
        console.log('Schema for plantel table:');
        console.log(JSON.stringify(rows, null, 2));
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkColumns();
