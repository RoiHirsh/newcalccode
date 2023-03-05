from flask import Flask, render_template, request, jsonify
import csv

app = Flask(__name__)

filename = "files/inputzz.csv"   
with open(filename, 'r', encoding='utf-8') as file:
    csv_reader = csv.reader(file)
    rows = list(csv_reader)

num_columns = len(rows[0])
relevant_columns = []

for col in range (4, num_columns):
    for row in range(1, len(rows)):
        if rows[row][col] == '1':
            relevant_columns.append(rows[0][col])
            break

@app.route("/")
def index():
    return render_template("homepage.html", cols=relevant_columns)

@app.route("/get_laws")
def get_laws():
    id = request.args.get("id")
    with open(filename, "r", encoding='utf-8') as file:
        csv_reader = csv.reader(file)
        # Find the column index for the given id
        header = next(csv_reader)
        if id not in header:
            return jsonify(None)
        index = header.index(id)
        # Collect the values in columns A, B, C, and D for the rows where the column has a value of 1
        rows = []
        for i, row in enumerate(csv_reader):
            if row[index] == "1":
                rows.append([row[0], row[1], row[2], row[3],i+2])
        return jsonify(rows)

if __name__ == "__main__":
    app.run(debug=True)
