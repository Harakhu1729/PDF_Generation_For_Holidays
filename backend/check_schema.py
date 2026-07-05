import sqlite3

con = sqlite3.connect('bookings.db')
cursor = con.cursor()

print("=== BOOKINGS TABLE SCHEMA ===")
cursor.execute('PRAGMA table_info(bookings)')
for row in cursor.fetchall():
    print(row)

print("\n=== ALL TABLES ===")
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
for row in cursor.fetchall():
    print(row)

con.close()